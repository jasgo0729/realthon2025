import React, { useState } from 'react';

// ---------------------------------------------------------------------
// 1. 데이터 타입 정의 (스크린샷 기반 추정)
// ---------------------------------------------------------------------

/**
 * AI 에이전트 또는 MBTI 스타일의 역할 결과 데이터 타입
 * reason은 긴 설명 텍스트입니다.
 */
interface RoleResult {
  name: string;
  reason: string;
  role: string;
}

// ---------------------------------------------------------------------
// 2. 가상 데이터 (스크린샷 내용 기반)
// ---------------------------------------------------------------------

const dummyResults: RoleResult[] = [
  {
    name: "리더 및 비즈니스 모델 분석가",
    reason: "현재 프로젝트의 성격, 강점, 약점을 모두 파악하여 가장 합리적인 비즈니스 모델을 도출합니다. 데이터 분석을 통해 시장을 예측하고 장기적인 비전 제시를 선호합니다. 전략 수립에 최적화되어 있습니다.",
    role: "경영진 및 시장 분석가 (Leader & Business Model Analyst)",
  },
  {
    name: "데이터 기반 의사 결정자",
    reason: "정확한 정보와 논리적인 근거를 선호하며, 모든 결정을 데이터의 흐름과 패턴에 기반합니다. 감정적인 판단을 지양하고 객관적인 지표를 사용하여 문제를 해결하며, 분석 결과의 시각화에 능숙합니다.",
    role: "데이터 분석 및 리스크 매니저 (Data Analyst & Risk Manager)",
  },
  {
    name: "창의적 아이디어 기획자",
    reason: "새롭고 독특한 아이디어를 끊임없이 생성하며, 기존의 틀을 깨는 혁신적인 접근을 시도합니다. 팀의 분위기를 활성화하고, 아이디어를 구체적인 실행 계획으로 전환하는 데 강점을 보입니다.",
    role: "제품 기획 및 마케팅 디자이너 (Product Planner & Marketing Designer)",
  },
];

// ---------------------------------------------------------------------
// 3. React 컴포넌트
// ---------------------------------------------------------------------

/**
 * MBTI 결과 스타일의 단일 정보 표시 컴포넌트
 * @param results - 표시할 결과 데이터 배열 (첫 번째 항목을 메인으로 사용)
 */
const MbtiResultDisplay = ({ results = dummyResults, username }: { results?: RoleResult[], username: string }) => {
  const [showResult, setShowResult] = useState(false);

  if (!results || results.length === 0) {
    return <div className="app-container" style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>표시할 결과 데이터가 없습니다.</div>;
  }

  let myResult = results[0];
  results.forEach(result => {
    if (result.name == username) {
        myResult = result;
    }
  });

  return (
    <div className="app-container">
      
      {/* 💡 Vanilla CSS 스타일 정의 */}
      <style>
        {`
          .app-container {
            min-height: 100vh;
            background-color: #f9fafb;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 16px;
            font-family: Arial, sans-serif;
          }
          .btn-primary {
            padding: 12px 32px;
            background-color: #10b981;
            color: white;
            font-size: 20px;
            font-weight: bold;
            border: none;
            border-radius: 9999px; /* rounded-full */
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 64px;
            margin-bottom: 64px;
          }
          .btn-primary:hover {
            background-color: #059669;
            transform: scale(1.05);
          }
          .modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 50;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
            padding: 16px;
          }
          .modal-content {
            width: 100%;
            max-width: 768px; /* max-w-2xl */
            background-color: white;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border-radius: 1rem; /* rounded-2xl */
            overflow-y: auto;
            max-height: 90vh;
            transition: transform 0.5s;
          }
          .header-blue {
            padding: 32px;
            background-color: #2563eb; /* blue-600 */
            color: white;
          }
          .header-title {
            font-size: 14px;
            font-weight: 300;
            opacity: 0.8;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .header-main-name {
            font-size: 40px;
            font-weight: 800;
            margin-top: 4px;
          }
          @media (min-width: 640px) {
            .header-main-name { font-size: 48px; }
            .header-blue { padding: 40px; }
          }
          .header-role {
            margin-top: 8px;
            font-size: 16px;
            font-weight: 500;
            background-color: #1d4ed8; /* blue-700 */
            display: inline-block;
            padding: 4px 12px;
            border-radius: 9999px;
          }
          .body-content {
            padding: 32px;
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          .summary-card {
            background-color: #fffbeb; /* yellow-50 */
            border-left: 4px solid #f59e0b; /* border-yellow-500 */
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          }
          .summary-title {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
          }
          .other-roles-list {
            padding-top: 16px;
            border-top: 1px solid #f3f4f6;
            list-style: none;
            padding-left: 0;
            margin-top: 0;
          }
          .other-role-item {
            display: flex;
            align-items: flex-start;
            background-color: #f9fafb;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            margin-bottom: 12px;
          }
          .btn-close {
            color: #9ca3af;
            background: none;
            border: none;
            cursor: pointer;
            transition: color 0.3s;
            padding: 8px;
          }
          .btn-close:hover {
            color: #4b5563;
          }
        `}
      </style>

      {/* 💡 1. 결과 보기 버튼 */}
      <button
        onClick={() => setShowResult(true)}
        className="btn-primary"
      >
        나의 AI 역할 분석 결과 보기
      </button>

      {/* 💡 2. 결과 모달 */}
      {showResult && (
        <div className="modal-backdrop" onClick={() => setShowResult(false)}>
          
          {/* 🟢 모달 콘텐츠 */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            {/* 닫기 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px', backgroundColor: 'white', position: 'sticky', top: 0, borderBottom: '1px solid #f3f4f6', zIndex: 10 }}>
              <button
                onClick={() => setShowResult(false)}
                className="btn-close"
                aria-label="결과 닫기"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 헤더: 타입과 핵심 역할 */}
            <div className="header-blue">
              <h1 className="header-title">나의 핵심 역할 유형 분석</h1>
              
              <h2 className="header-main-name">
                {myResult.name}
              </h2>
              
              <p className="header-role">
                {myResult.role}
              </p>
            </div>

            {/* 바디: 상세 설명 및 분석 */}
            <div className="body-content">
              
              {/* ✨ 결과 요약 카드 */}
              <div className="summary-card">
                <h3 className="summary-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" style={{ marginRight: '8px', color: '#f59e0b' }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  당신의 성향 분석
                </h3>
                <p style={{ color: '#374151', lineHeight: '1.625' }}>{myResult.reason}</p>
              </div>

              {/* 📊 다른 역할과의 비교 */}
              {results.length > 1 && (
                <div style={{ paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>함께 고려해 볼 수 있는 다른 역할</h3>
                  <ul className="other-roles-list">
                    {results.slice(1).map((otherResult, index) => (
                      <li key={index} className="other-role-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style={{ color: '#10b981', flexShrink: 0, marginTop: '2px', marginRight: '12px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.276a2 2 0 010 2.919l-3.32 3.32a2 2 0 01-2.828 0l-1.66-1.66a2 2 0 010-2.828l3.32-3.32a2 2 0 012.919 0z" />
                        </svg>
                        <div>
                          <span style={{ fontWeight: 600, color: '#1f2937' }}>{otherResult.name}</span>
                          <p style={{ fontSize: '14px', color: '#4b5563', fontStyle: 'italic', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                            {otherResult.reason.substring(0, 50)}...
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* 푸터 */}
            <div style={{ padding: '32px', backgroundColor: '#f3f4f6', textAlign: 'center' }}>
              <button
                onClick={() => setShowResult(false)}
                style={{ color: '#2563eb', fontWeight: 500, transition: 'color 0.3s', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                결과 창 닫기
              </button>
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>본 분석은 인공지능 기반의 성향 예측 결과이며, 참고 자료로 활용하시기 바랍니다.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MbtiResultDisplay;