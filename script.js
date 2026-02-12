const connectBtn = document.getElementById("connectBtn");
const drawBtn = document.getElementById("drawBtn");
const resultText = document.getElementById("resultText");

let currentAccount = null;

function shortAddr(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function setResult(msg) {
  resultText.textContent = msg;
}

function setConnected(account) {
  currentAccount = account;
  connectBtn.textContent = shortAddr(account);
  setResult("지갑 연결 완료! 이제 Cat Card Draw를 눌러봐 🐾");
}

function setDisconnected() {
  currentAccount = null;
  connectBtn.textContent = "Connect MetaMask";
}

async function connectMetaMask() {
  if (!window.ethereum) {
    setResult("메타마스크를 설치하거나(PC), 메타마스크 앱 브라우저(모바일)로 열어줘!");
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    if (accounts && accounts.length > 0) setConnected(accounts[0]);
    else setResult("연결 실패… 다시 시도해줘!");
  } catch (e) {
    setResult("연결을 취소했어. 다시 연결하려면 오른쪽 위 버튼을 눌러줘!");
  }
}

connectBtn.addEventListener("click", connectMetaMask);

drawBtn.addEventListener("click", () => {
  if (!window.ethereum) {
    setResult("메타마스크가 필요해! 먼저 설치/실행해줘.");
    return;
  }
  if (!currentAccount) {
    setResult("먼저 지갑을 연결해줘! (오른쪽 위 Connect MetaMask)");
    return;
  }

  setResult("드로우 중... 🐱🎴");

  // 데모용 랜덤 결과 (나중에 컨트랙트 호출로 바꾸면 됨)
  const cats = ["Strawberry Cat", "Cloud Cat", "Cherry Cat", "Angel Cat", "Sparkle Cat"];
  const picked = cats[Math.floor(Math.random() * cats.length)];

  setTimeout(() => {
    setResult(`🎉 결과: ${picked}  🐾`);
  }, 650);
});

// 계정 변경 자동 반영
if (window.ethereum?.on) {
  window.ethereum.on("accountsChanged", (accounts) => {
    if (accounts && accounts.length > 0) {
      setConnected(accounts[0]);
      setResult("계정이 변경됐어! 다시 드로우할 수 있어 🐾");
    } else {
      setDisconnected();
      setResult("지갑이 연결 해제됐어. 다시 연결해줘!");
    }
  });
}
