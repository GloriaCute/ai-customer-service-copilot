"use client";

import { useMemo, useState } from "react";
import { knowledgeDocuments } from "../lib/knowledge-data";

export function KnowledgeWorkspace() {
  const [selectedId, setSelectedId] = useState(knowledgeDocuments[0].id);
  const selectedDocument = useMemo(
    () => knowledgeDocuments.find((document) => document.id === selectedId) ?? knowledgeDocuments[0],
    [selectedId],
  );

  return (
    <section className="knowledge-workspace" aria-label="企业知识资料">
      <aside className="panel knowledge-list-panel">
        <header className="knowledge-list-header"><h1>知识资料 <span>（{knowledgeDocuments.length}）</span></h1></header>
        <div className="knowledge-list">
          {knowledgeDocuments.map((document) => (
            <button className={`knowledge-list-item ${document.id === selectedId ? "is-active" : ""}`} type="button" onClick={() => setSelectedId(document.id)} key={document.id}>
              <strong>{document.displayName}</strong>
              <span className="knowledge-file-name">{document.fileName}</span>
              <div className="knowledge-tags"><span>{document.category}</span><span className="enabled-tag"><i />{document.status}</span></div>
              <div className="knowledge-list-meta"><span>更新时间：{document.updatedAt}</span><span>托管：Dify Cloud</span></div>
            </button>
          ))}
        </div>
      </aside>

      <article className="panel knowledge-detail-panel">
        <div className="knowledge-detail-scroll">
          <header className="knowledge-detail-header">
            <p className="knowledge-file-name">{selectedDocument.fileName}</p>
            <h1>{selectedDocument.displayName}</h1>
            <div className="knowledge-detail-meta">
              <span>分类：{selectedDocument.category}</span>
              <span className="enabled-tag"><i />状态：{selectedDocument.status}</span>
              <span>来源：{selectedDocument.source}</span>
              <span>更新时间：{selectedDocument.updatedAt}</span>
              <span>知识托管：Dify Cloud</span>
            </div>
          </header>

          <section className="knowledge-section">
            <div className="knowledge-section-title"><span className="section-icon" aria-hidden="true">✓</span><h2>知识覆盖范围</h2></div>
            <div className="coverage-grid">{selectedDocument.coverage.map((item) => <div key={item}>{item}</div>)}</div>
          </section>

          <section className="knowledge-section">
            <div className="knowledge-section-title"><span className="section-icon" aria-hidden="true">≡</span><h2>内容预览</h2></div>
            <div className="preview-list">
              {selectedDocument.previews.map((preview, index) => (
                <article className="preview-card" key={preview.title}>
                  <div><i /><h3>{index + 1}. {preview.title}</h3></div>
                  <p>{preview.content}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="knowledge-boundary">
            <span className="boundary-icon" aria-hidden="true">□</span>
            <div><h2>知识边界</h2><p>AI 客服助手仅根据当前已连接的企业知识资料生成建议。当现有资料无法支持确定性回答时，系统应提示人工确认。</p></div>
          </section>
        </div>
      </article>
    </section>
  );
}
