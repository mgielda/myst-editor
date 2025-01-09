import { computed, effect, signal } from "@preact/signals";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness.js";
import { hideUsernames } from "./extensions/hideUsernames";
import { YComments } from "./comments/ycomments";

export class CollaborationClient {
  synced = signal(false);
  connected = signal(false);

  constructor(settings, editorOptions = { id: null, parent: null, hideUsernameDelay: null, getAvatar: () => {}, getUserUrl: () => {} }) {
    this.ready = computed(() => this.synced.value && this.connected.value);
    this.ydoc = new Y.Doc();
    this.provider = new WebsocketProvider(settings.wsUrl, settings.room, this.ydoc, {
      connect: true,
      params: {},
      WebSocketPolyfill: WebSocket,
      awareness: new awarenessProtocol.Awareness(this.ydoc),
      maxBackoffTime: 2500,
    });

    this.provider.awareness.setLocalStateField("user", {
      name: settings.username,
      color: settings.color,
    });

    this.provider.on("sync", (sync) => (this.synced.value = sync));
    this.provider.on("status", ({ status }) => (this.connected.value = status == "connected"));

    if (editorOptions.parent) {
      hideUsernames({
        ytext: this.ydoc.getText("codemirror"),
        prov: this.provider,
        parent: editorOptions.parent,
        hideDelay: editorOptions.hideUsernameDelay,
      });
    }

    this.ytext = this.ydoc.getText("codemirror");
    this.undoManager = new Y.UndoManager(this.ytext, {
      trackedOrigins: new Set([this.provider.doc.clientID, null]),
      ignoreRemoteMapChanges: true,
    });

    if (settings.commentsEnabled && editorOptions.id) {
      this.ycomments = new YComments(this.ydoc, this.provider, editorOptions.getAvatar, editorOptions.getUserUrl);
    }
  }

  destroy() {
    this.provider.destroy();
    this.ydoc.destroy();
  }
}

WebsocketProvider.prototype.watchCollabolators = function (hook) {
  this.awareness.on("change", ({ added, removed }) => {
    if (added || removed) {
      let collabolators = Array.from(this.awareness.states)
        .map(([key, { user }]) => ({ login: user.name, color: user.color }))
        .reduce((curr, data) => {
          curr[data.login] = data;
          return curr;
        }, {});
      hook(Object.values(collabolators));
    }
  });
};