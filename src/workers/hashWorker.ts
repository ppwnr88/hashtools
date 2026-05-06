self.onmessage = () => {
  self.postMessage({ type: "ready" });
};
