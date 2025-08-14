import Header from "./header";

export default async function serverAction(username){
      const result = await updateSessionCookie(); // Get the full result
      const { user: authUser, session } = result || {}; // Destructure with fallback
      console.log("AuthUser in RootLayout:", authUser, "Session:", session);
      const username = authUser?.username || (authUser ? "unknown" : "guest");
        return (
          <html lang="en" className={`${poppins.variable} ${openSans.variable}`}>
            <Header username={username} />
            <body className="margin-top">{children}</body>
          </html>
        );
      
}