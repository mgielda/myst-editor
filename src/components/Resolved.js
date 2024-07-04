import { html } from "htm/preact";
import { useState, useMemo } from "preact/hooks";
import styled from "styled-components";
import ResolvedComment from "./ResolvedComment";

const ResolvedWrapper = styled.div`
  background-color: white;
  padding: 20px 0;
  min-height: 150px;
  border: 1px solid var(--gray-400);
  border-left: 1px solid var(--gray-600);
  box-shadow: inset 0px 0px 4px var(--gray-600);
  border-radius: var(--border-radius);
  font-family: "Lato", sans-serif;
  color: var(--gray-900);

  & h1 {
    font-size: 20px;
    padding-left: 100px;
    margin-bottom: 0;
  }
`;

const VerticalSparator = styled.hr`
  border: none;
  height: 1px;
  background-color: var(--gray-600);
  margin-top: 20px;
  margin-bottom: 0;
`;

const CommentsContainer = styled.div`
  margin-left: 100px;
  border-left: 1px solid var(--gray-600);

  & ul,
  p {
    margin-top: 0;
  }
`;

ResolvedWrapper.defaultProps = { className: "myst-resolved" };

const ResolvedComments = ({ ycomments }) => {
  let [resolvedComments, setResolvedComments] = useState(ycomments.resolver().resolved());
  let commentContents = useMemo(
    () =>
      resolvedComments.reduce((contents, { commentId }) => {
        contents[commentId] = ycomments.getTextForComment(commentId).toString();
        return contents;
      }, {}),
    [resolvedComments],
  );
  let authors = useMemo(() => resolvedComments.map((c) => ycomments.lineAuthors(c.commentId)), [resolvedComments]);

  ycomments.resolver().onUpdate(setResolvedComments);

  return html` <${ResolvedWrapper}>
    <h1>Resolved comments</h1>
    <${VerticalSparator} />
    <${CommentsContainer}> ${resolvedComments.map((c, idx) => ResolvedComment({ c, idx, authors, ycomments, commentContents }))} <//>
  <//>`;
};

export default ResolvedComments;