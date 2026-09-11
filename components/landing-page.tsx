import Image from "next/image";
import Link from "next/link";

const capabilities = [
  {
    number: "01",
    tone: "supported",
    title: "知识支持回答",
    description: "基于企业内部政策、会员手册和官方规则库生成建议回复，并逐项标明引用的条款依据，确保每一句话有据可查。",
    note: "基于已连接知识生成",
  },
  {
    number: "02",
    tone: "clarify",
    title: "需要补充信息",
    description: "当客户提供的提问条件不足以做出定性结论时，系统不会臆断或自圆其说，而是主动提示仅询问真正影响判定的关键信息。",
    note: "仅追问影响结论的信息",
  },
  {
    number: "03",
    tone: "review",
    title: "人工确认兜底",
    description: "对于知识库未覆盖的业务边界、特定例外政策或涉及高风险客诉的场景，系统主动提示人工专员介入，坚守安全风控底线。",
    note: "保留人工最终决定权",
  },
] as const;

const workflowSteps = [
  { step: "STEP 01", title: "客户问题输入", description: "接收客户提出的退换货、配送或会员权益咨询。" },
  { step: "STEP 02", title: "查询与知识检索", description: "围绕业务要素检索当前已连接的企业知识资料。" },
  { step: "STEP 03", title: "AI 建议生成", description: "生成可审核的建议回复，并呈现实际返回的知识依据。" },
  { step: "STEP 04", title: "客服采用 / 确认", description: "客服可以采用、编辑建议，必要时转由人工进一步确认。" },
] as const;

const productModules = [
  {
    label: "Module 01",
    title: "收件箱工作台",
    englishTitle: "Inbox Copilot",
    description: "面向客服日常使用的核心工作区，将客户会话、AI 建议、知识依据与人工操作放在同一处理流程中。",
    image: "/landing/inbox-preview.png",
    alt: "当前 AI 客服收件箱工作台页面",
    href: "/inbox",
    points: ["客户会话与回复编辑", "三态 AI 建议", "真实知识来源与人工确认"],
  },
  {
    label: "Module 02",
    title: "企业知识库",
    englishTitle: "Knowledge Center",
    description: "查看 AI 当前可使用的企业知识资料、覆盖范围与知识边界，保持业务阅读视角。",
    image: "/landing/knowledge-preview.png",
    alt: "当前企业知识库页面",
    href: "/knowledge",
    points: ["已连接知识资料", "业务覆盖范围", "知识边界说明"],
  },
  {
    label: "Module 03",
    title: "AI 评测",
    englishTitle: "Evaluation",
    description: "通过代表性案例检查简单问答、复合规则与知识不足场景下的回答状态和业务边界。",
    image: "/landing/evaluation-preview.png",
    alt: "当前 AI 评测页面",
    href: "/evaluation",
    points: ["三类代表性案例", "预期与实际状态对照", "逐项验证检查"],
  },
] as const;

const principles = [
  { tone: "green", title: "真实知识约束", description: "回复建议基于当前已连接的企业知识资料生成，不用无依据内容补齐答案。" },
  { tone: "indigo", title: "主动暴露边界", description: "信息不足或知识未覆盖时，明确进入补充信息或人工确认流程。" },
  { tone: "blue", title: "来源依据可追溯", description: "Dify 返回可展示来源时，客服可以查看建议所参考的知识资料。" },
  { tone: "purple", title: "人工最终确认", description: "AI 始终提供辅助建议，客服保留编辑、采用与最终处理决定权。" },
] as const;

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 6l4 4-4 4" />
    </svg>
  );
}

export function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header-wrap">
        <div className="landing-header">
          <Link className="landing-brand" href="#overview" aria-label="返回产品概述">
            <span className="landing-brand-mark" aria-hidden="true">宜</span>
            <span>AI 客服 Copilot</span>
          </Link>
          <nav className="landing-nav" aria-label="首页导航">
            <a href="#overview">产品概述</a>
            <a href="#capabilities">核心能力</a>
            <a href="#workflow">处理流程</a>
            <a href="#product-suite">产品预览</a>
            <Link href="/evaluation">AI 评测</Link>
          </nav>
          <div className="landing-header-actions">
            <a className="landing-text-link" href="#principles">项目说明</a>
            <Link className="landing-button landing-button-dark landing-button-compact" href="/inbox">立即体验</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="landing-hero landing-container" id="overview">
          <div className="landing-hero-copy">
            <span className="landing-eyebrow"><i />Enterprise AI Customer Support</span>
            <h1><span>让企业知识成为客服的</span><span>实时决策支持</span></h1>
            <p>基于知识检索生成可审核、可追溯的回复建议，帮助客服在知识支持、补充信息与人工确认之间做出更稳妥的处理决策。</p>
            <div className="landing-hero-actions">
              <Link className="landing-button landing-button-dark" href="/inbox">进入客服工作台<ArrowIcon /></Link>
              <Link className="landing-button landing-button-light" href="/evaluation">查看 AI 评测</Link>
            </div>
            <div className="landing-proof-list" aria-label="产品能力摘要">
              {['知识支持', '知识可追溯', '人工确认'].map((item) => <span key={item}><i>✓</i>{item}</span>)}
            </div>
          </div>
          <Link className="landing-hero-preview" href="/inbox" aria-label="打开客服工作台">
            <div className="landing-preview-bar">
              <span className="landing-window-dots"><i /><i /><i /></span>
              <strong>AI 客服工作台</strong>
              <span className="landing-preview-status"><i />知识已连接</span>
            </div>
            <Image src="/landing/inbox-preview.png" alt="AI 客服收件箱工作台真实预览" width={1440} height={900} priority sizes="(max-width: 960px) 100vw, 54vw" />
          </Link>
        </section>

        <section className="landing-section landing-section-bordered" id="capabilities">
          <div className="landing-container">
            <div className="landing-section-heading">
              <span>Core Capabilities</span>
              <h2>AI 不只是生成答案，而是辅助判断</h2>
              <p>围绕企业知识边界建立清晰、可审核的人机协作方式。</p>
            </div>
            <div className="landing-capability-grid">
              {capabilities.map((item) => (
                <article className="landing-info-card" key={item.number}>
                  <div>
                    <span className={`landing-card-number is-${item.tone}`}>{item.number}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <footer className={`is-${item.tone}`}><i />{item.note}</footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section landing-workflow-section" id="workflow">
          <div className="landing-container">
            <div className="landing-section-heading">
              <span>Workflow</span>
              <h2>清晰可控的实时人机协作流程</h2>
              <p>从问题接收到人工处理，每个关键环节都清晰可见。</p>
            </div>
            <div className="landing-workflow-grid">
              {workflowSteps.map((item, index) => (
                <article className="landing-workflow-card" key={item.step}>
                  <span>{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {index < workflowSteps.length - 1 ? <i className="landing-workflow-arrow" aria-hidden="true">→</i> : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section landing-section-bordered" id="product-suite">
          <div className="landing-container">
            <div className="landing-section-heading">
              <span>Product Suite</span>
              <h2>三个核心产品模块</h2>
              <p>收件箱工作台、企业知识库与 AI 评测，共同构成从知识支持到人工确认的完整产品体验。</p>
            </div>
            <div className="landing-product-grid">
              {productModules.map((item) => (
                <article className="landing-product-card" key={item.label}>
                  <Link className="landing-product-image" href={item.href} aria-label={`打开${item.title}`}>
                    <Image src={item.image} alt={item.alt} width={1440} height={900} sizes="(max-width: 980px) 100vw, 33vw" />
                  </Link>
                  <div className="landing-product-copy">
                    <span>{item.label}</span>
                    <h3>{item.title} <small>({item.englishTitle})</small></h3>
                    <p>{item.description}</p>
                  </div>
                  <ul>
                    {item.points.map((point) => <li key={point}><i>✓</i>{point}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section landing-principles-section" id="principles">
          <div className="landing-principles">
            <div className="landing-section-heading">
              <span>Product Principles</span>
              <h2>可靠回答的产品原则</h2>
              <p>让 AI 在企业知识边界内提供建议，并保留人工最终控制权。</p>
            </div>
            <div className="landing-principles-grid">
              {principles.map((item) => (
                <article key={item.title}>
                  <h3><i className={`is-${item.tone}`} />{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-bottom-cta landing-section-bordered">
          <h2>让 AI 成为客服的知识协作伙伴</h2>
          <p>以企业知识为基础，为客服提供可审核、可追溯并保留人工决策权的建议支持。</p>
          <Link className="landing-button landing-button-dark" href="/inbox">进入工作台<ArrowIcon /></Link>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-brand"><span className="landing-brand-mark" aria-hidden="true">宜</span><strong>AI 客服 Copilot</strong></div>
          <div>
            <p>本项目为企业 AI 客服作品集原型，基于宜家公开资料构建，不代表宜家官方产品。</p>
            <small>知识托管：Dify Cloud</small>
          </div>
        </div>
      </footer>
    </div>
  );
}
