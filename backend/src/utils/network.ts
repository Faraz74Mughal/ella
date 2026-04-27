import dns from "dns"

function checkInternet() {
  return new Promise((resolve) => {
    dns.resolve("google.com", (err) => {
      resolve(!err);
    });
  });
}

export default checkInternet;