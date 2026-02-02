(async () => {
  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "kepalasekolah@sman1bandung.sch.id",
        password: "password123",
      }),
    });
    const text = await res.text();
    console.log("STATUS:", res.status);
    console.log("HEADERS:", Object.fromEntries(res.headers.entries()));
    console.log("BODY:", text);
  } catch (err) {
    console.error("ERROR:", err);
    process.exitCode = 1;
  }
})();
