# 🚌 버스기사 탈출 (Bus Driver Escape)
> **"혼자 운전하지 마세요. AI 크루가 함께 탑승합니다."**
> 
> **Human-AI Hybrid Multi-Agent Collaboration Platform for Group Projects**

## 📖 Project Overview (프로젝트 개요)
**버스기사 탈출**은 대학 생활 조별과제에서 발생하는 고질적인 '무임승차(Free-riding)'와 '독박 업무(Bus Driving)' 문제를 해결하기 위한 **AI 기반 협업 솔루션**입니다.

단순히 업무를 자동화하는 도구를 넘어, OpenAI가 제시한 **'The Age of Agents'**의 비전에 맞춰 **사람과 AI Agent가 팀원으로서 대등하게 소통하고 협업하는 하이브리드 환경**을 제공합니다.

---

## 🚀 Key Features & Technical Logic (핵심 기능 및 기술 로직)

### 1. 🧊 Ice-breaking & Intelligent Role Assignment (성향 분석 및 역할 분배)
초기 팀 빌딩 단계에서 발생하는 어색함을 해소하고, 데이터 기반의 공정한 역할 분배를 수행합니다.

* **Communication Layer (`socat`):**
    * `socat` 유틸리티를 활용하여 실시간 채팅 인터페이스를 구현했습니다.
    * Raw Socket 통신을 통해 가볍고 빠른 메시지 교환 환경을 구축했습니다.
* **Analysis Pipeline:**
    * 채팅 세션 종료 시, 백엔드(Backend) 트리거가 발동하여 누적된 대화 로그를 텍스트 데이터로 추출합니다.
    * 추출된 데이터는 LLM의 Context로 주입되며, LLM은 각 발화자의 **어휘 선택, 문맥적 주도성, 반응성** 등을 분석합니다.
    * **Result:** 사전에 정의된 프로젝트 요구사항(기획, 개발, 디자인 등)과 매칭하여 최적의 역할을 각 유저에게 할당합니다.

### 2. 🤖 Human-AI Hybrid Multi-Agent System (멀티 에이전트 협업)
인원이 부족하거나 아이디어가 고갈된 상황에서, **Generative Agents(Stanford & Google)** 논문의 아키텍처에서 영감을 받은 AI 에이전트들이 회의에 참여합니다.

* **Orchestrator Architecture:**
    * 중앙 집중형 **Orchestrator**가 공통의 발화 내용(Public Discourse)을 관리하고 각 에이전트에게 브로드캐스팅하는 구조를 채택하여 데이터의 정합성을 유지합니다.
* **🧠 Unique Selling Point: Thinking Token (내적 사고 메커니즘)**
    * 기존 챗봇과의 차별점은 **'Thinking Token'**의 도입입니다.
    * 각 에이전트는 발화(Speak)하기 전, 자신만의 **'생각(Thinking)' 단계**를 거칩니다.
    * **Private Context:** 이 Thinking Token은 사용자나 다른 에이전트에게는 보이지 않고, 해당 에이전트의 내부 메모리에만 **고유하게 계승(Inherit)**됩니다.
    * **Effect:** 이를 통해 에이전트는 단순한 리액션이 아닌, **"이전에 내가 가졌던 의도와 페르소나"**를 기억하며 논리적으로 일관된 주장을 펼칠 수 있습니다. (예: 비판적 페르소나는 계속해서 논리적 허점을 찾는 사고 과정을 내부에 누적함)

---

## 🛠 System Architecture (시스템 아키텍처)

```mermaid
graph TD
    subgraph "Phase 1: Ice-breaking"
    User[User Group] -- "Socat Chat" --> ChatLog[Text Extraction]
    ChatLog --> Analyzer[LLM Role Analyzer]
    Analyzer --> Role[Role Assignment]
    end

    subgraph "Phase 2: Hybrid Collaboration"
    Role --> Session[Hybrid Meeting Session]
    Human[Human User] -- "Input" --> Orch[Orchestrator]
    
    Orch -- "Broadcast Context" --> AgentA[Agent: Critic]
    Orch -- "Broadcast Context" --> AgentB[Agent: Creative]
    
    subgraph "Agent Internal Process"
        AgentA -- "Private" --> ThinkA[Thinking Token (Hidden)]
        ThinkA -- "Reasoning" --> OutputA[Public Speech]
        ThinkA -.-> ThinkA_Next[Next Thinking Step]
    end
    
    OutputA --> Orch
    end
💻 Tech Stack (기술 스택)
Core: Python, LLM Integration (OpenAI API / Local LLM)

Network: socat (Socket CAT) for Chat implementation

Agent Framework: Custom Orchestrator with LangChain/LangGraph logic

Infrastructure: Docker (Containerization)

🎯 Goal & Vision
우리는 AI를 인간의 지적 노동을 대체하는 것을 넘어, **함께 사고하고 토론하는 동료(Coworker)**로 정의합니다. **'Thinking Token'**을 통해 깊이 있는 사고가 가능한 에이전트와의 협업은, 대학생들이 겪는 물리적 인원 부족과 아이디어의 한계를 극복하는 가장 확실한 솔루션이 될 것입니다.