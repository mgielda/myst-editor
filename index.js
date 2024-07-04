import "./MystEditor2.js";
import u, { render as l, html as d, defaultButtons as c } from "./MystEditor.js";
(function() {
  const i = document.createElement("link").relList;
  if (i && i.supports && i.supports("modulepreload"))
    return;
  for (const e of document.querySelectorAll('link[rel="modulepreload"]'))
    n(e);
  new MutationObserver((e) => {
    for (const o of e)
      if (o.type === "childList")
        for (const a of o.addedNodes)
          a.tagName === "LINK" && a.rel === "modulepreload" && n(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function r(e) {
    const o = {};
    return e.integrity && (o.integrity = e.integrity), e.referrerpolicy && (o.referrerPolicy = e.referrerpolicy), e.crossorigin === "use-credentials" ? o.credentials = "include" : e.crossorigin === "anonymous" ? o.credentials = "omit" : o.credentials = "same-origin", o;
  }
  function n(e) {
    if (e.ep)
      return;
    e.ep = !0;
    const o = r(e);
    fetch(e.href, o);
  }
})();
let m = `# h1 is quite big

## [h2 which is a link](https://google.com)

Issue in this repo: #1
PR in this repo: !2
Issue in another repo: github/docs#30828
PR in another repo: github/docs!100
Person/org handle: @antmicro

### h3

#### h4

##### h5

###### h6 is the size of the regular font

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore

Veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores

  * Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed [do eiusmod tempor incididunt](site.com) ut labore et dolore magna aliqua
  * Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt
    * Nam libero tempore, cum soluta \`nobis est eligendi\` optio cumque nihil impedit quo minus id quod maxime
    * Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores tempor incididunt ut \`labore et dolore\` magna aliqua
      * Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        Eos qui ratione voluptatem sequi nesciunt
    * Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
  * Lorem Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores

Unhandled role: {unknown}\`content\` in paragraph.

Raw role: {raw}\`content\`

Unhandled directive:

\`\`\`{unknown} argument
content
\`\`\`

Erroneous directive:

\`\`\`{admonition}
\`\`\`

Admonition with title

\`\`\`{admonition} A **Title**
Some *content*
\`\`\`

Nested admonitions:

\`\`\`\`{note} This is a note
\`\`\`{warning} This is a nested warning
\`\`\`
\`\`\`\`

Images and figures:

\`\`\`{image} https://via.placeholder.com/150
:align: center
\`\`\`

\`\`\`{figure} https://via.placeholder.com/150
:align: center
:name: placeholder

A **caption**
\`\`\`

The placeholder figure is {numref}\`Figure %s <placeholder>\`.
The \`ref\` link is: {ref}\`placeholder\`.
We can also see {eq}\`math_label\` which is below!

Tables:

\`\`\`{list-table} Caption *text*
:header-rows: 1

- * Heading, Column 1
  * Heading, Column 2
- * Row, Column 1
  * Row, Column 2

    Second paragraph
\`\`\`

HTML:

* H{sub}\`2\`O
* 4{sup}\`th\` of July
* {abbr}\`CSS (Cascading Style Sheets)`;
console.log("Welcome to the MyST editor demo. The right hand side should auto update.");
const s = ["#30bced", "#60c771", "#e6aa3a", "#cbb63e", "#ee6352", "#9ac2c9", "#8acb88", "#14b2c4"], p = "0", h = Math.floor(Math.random() * 1e3).toString(), g = s[Math.floor(Math.random() * s.length)];
let f = [{
  target: /[0-9a-z\-]+\/[0-9a-z\-]+#\d{1,10}/g,
  transform: (t) => {
    const [i, r] = t.split("#");
    return `<a href="https://github.com/${i}/issues/${r}">${t}</a>`;
  }
}, {
  target: /[0-9a-z\-]+\/[0-9a-z\-]+\!\d+/g,
  transform: (t) => {
    const [i, r] = t.split("!");
    return `<a href="https://github.com/${i}/pull/${r}">${t}</a>`;
  }
}, {
  target: new RegExp("(^|(?<=\\s))#\\d+", "g"),
  transform: (t) => `<a href="https://github.com/antmicro/myst-editor/issues/${t.slice(1)}">${t}</a>`
}, {
  target: new RegExp("(^|(?<=\\s))!\\d+", "g"),
  transform: (t) => `<a href="https://github.com/antmicro/myst-editor/pull/${t.slice(1)}">${t}</a>`
}, {
  target: /@[0-9a-z\-]+/g,
  transform: (t) => {
    const i = t.slice(1);
    return `
          <a href='https://github.com/${i}'>
            ${i}
          </a>`;
  }
}];
l(d`
          <${u}
            templatelist="linkedtemplatelist.json"
            initialText=${m}
            title="[MyST Editor](https://github.com/antmicro/myst-editor/) demo"
            id="textarea_id"
            transforms=${f}
            collaboration=${{
  enabled: {}.VITE_COLLAB == "ON",
  commentsEnabled: {}.VITE_COLLAB == "ON",
  wsUrl: {}.VITE_WS_URL,
  username: h,
  room: p,
  color: g
}}
            includeButtons=${c.concat([{
  text: "Custom button",
  action: () => alert("Custom button action")
}])}
            spellcheckOpts=${{
  dict: "en_US",
  dictionaryPath: "/myst-editor/dictionaries"
}}
          />
        `, document.getElementById("myst"));