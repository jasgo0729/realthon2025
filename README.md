# 🚌 버스기사 탈출 (Bus Driver Escape)

> **"혼자 운전하지 마세요. AI 크루가 함께 탑승합니다."**
>
> **Human-AI Hybrid Multi-Agent Collaboration Platform for Group Projects**

![Project Status](https://img.shields.io/badge/Status-In%20Development-green)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![Tech](https://img.shields.io/badge/AI-Multi%20Agent-purple)
![Tools](https://img.shields.io/badge/Tools-Socat%20%7C%20Docker-orange)

## 📖 Project Overview

**버스기사 탈출**은 대학 생활 조별과제에서 발생하는 고질적인 **'무임승차(Free-riding)'**와 **'독박 업무(Bus Driving)'** 문제를 해결하기 위한 **AI 기반 협업 솔루션**입니다.

단순히 업무를 자동화하는 도구를 넘어, OpenAI가 제시한 **'The Age of Agents'**의 비전에 맞춰 **사람과 AI Agent가 팀원으로서 대등하게 소통하고 협업하는 하이브리드 환경**을 제공합니다.

---

## 🚀 Key Features & Technical Logic

### 1. 🧊 Ice-breaking & Intelligent Role Assignment
초기 팀 빌딩 단계에서 발생하는 어색함을 해소하고, 데이터 기반의 공정한 역할 분배를 수행합니다.

* **Communication Layer (`socat`)**
    * `socat` 유틸리티를 활용하여 가볍고 빠른 Raw Socket 기반의 실시간 채팅 인터페이스를 구현했습니다.
* **Analysis Pipeline**
    * 채팅 세션 종료 시, 백엔드 트리거가 발동하여 누적된 대화 로그를 텍스트 데이터로 추출합니다.
    * LLM이 추출된 데이터를 Context로 받아 각 발화자의 **어휘 선택, 문맥적 주도성, 반응성** 등을 분석합니다.
    * **Result:** 분석 결과를 기획, 개발, 디자인 등 사전에 정의된 요구사항과 매칭하여 최적의 역할을 할당합니다.

### 2. 🤖 Human-AI Hybrid Multi-Agent System
인원이 부족하거나 아이디어가 고갈된 상황에서, **Generative Agents (Stanford & Google)** 논문의 아키텍처에서 영감을 받은 AI 에이전트들이 회의에 참여합니다.

* **Orchestrator Architecture**
    * 중앙 집중형 **Orchestrator**가 공통의 발화 내용(Public Discourse)을 관리하고 각 에이전트에게 브로드캐스팅하여 데이터 정합성을 유지합니다.
* **🧠 Unique Selling Point: Thinking Token (내적 사고 메커니즘)**
    * 기존 챗봇과의 가장 큰 차별점은 **'Thinking Token'**의 도입입니다.
    * **Private Context:** 각 에이전트는 발화(Speak)하기 전, 자신만의 **'생각(Thinking)'** 단계를 거칩니다. 이 토큰은 사용자나 타 에이전트에게 보이지 않고 에이전트 내부 메모리에만 고유하게 계승(Inherit)됩니다.
    * **Effect:** 이를 통해 에이전트는 단순한 리액션이 아닌, **"이전에 내가 가졌던 의도와 페르소나"**를 기억하며 논리적으로 일관된 주장을 펼칠 수 있습니다. (예: 비판적 페르소나는 계속해서 논리적 허점을 찾는 사고 과정을 내부에 누적함)

---

## 🛠 System Architecture

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