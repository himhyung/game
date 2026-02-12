const connectBtn = document.getElementById("connectBtn");
const statusText = document.getElementById("statusText");
const walletText = document.getElementById("walletText");
const drawBtn = document.getElementById("drawBtn");
const resultText = document.getElementById("resultText");

let currentAccount = null;

function shortAddr(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function setConnectedUI(account) {
  currentAccount = account;
  statusText.textContent = "연결됨";
  walletText.textContent = account;
  connectBtn.textContent = shortAddr(account);
}

function setDisconnectedUI(message = "지갑 미연결") {
  currentAccount = null;
  statusText.textContent = message;
  walletText.textContent = "—";
  connectBtn.textContent = "Connect MetaMask";
}

async function connectMetaMask() {
  if (!window.ethereum) {
    setDisconnectedUI("메타마스크 없음");
    resultText.textContent = "메타마스크를 설치하거나(PC), 메타마스크 앱 브라우저(모바일)로 열어줘.";
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    if (accounts && accounts.length > 0) {
      setConnectedUI(accounts[0]);
      resultText.textContent = "지갑 연결 완료! 이제 Cat Card Draw를 눌러봐 🐾";
    } else {
      setDisconnectedUI("연결 실패");
    }
  } catch (err) {
    setDisconnectedUI("연결 취소됨");
    resultText.textContent = "연결을 취소했어. 다시 연결하려면 Connect MetaMask를 눌러줘.";
  }
}

connectBtn.addEventListener("click", connectMetaMask);

drawBtn.addEventListener("click", async () => {
  if (!window.ethereum) {
    resultText.textContent = "메타마스크가 필요해! 먼저 설치/실행해줘.";
    return;
  }
  if (!currentAccount) {
    resultText.textContent = "먼저 지갑을 연결해줘! (오른쪽 위 Connect MetaMask)";
    return;
  }

  resultText.textContent = "드로우 중... 🐱🎴";

  // 데모용 랜덤 결과 (나중에 컨트랙트 호출로 교체 가능)
  const cats = ["Strawberry Cat", "Cloud Cat", "Cherry Cat", "Angel Cat", "Sparkle Cat"];
  const picked = cats[Math.floor(Math.random() * cats.length)];

  setTimeout(() => {
    resultText.textContent = `🎉 결과: ${picked}`;
  }, 700);
});

// 계정 바뀌면 자동 반영
if (window.ethereum) {
  window.ethereum.on?.("accountsChanged", (accounts) => {
    if (accounts && accounts.length > 0) {
      setConnectedUI(accounts[0]);
      resultText.textContent = "계정이 변경됐어! 다시 드로우할 수 있어.";
    } else {
      setDisconnectedUI("지갑 미연결");
      resultText.textContent = "지갑이 연결 해제됐어.";
    }
  });
}
