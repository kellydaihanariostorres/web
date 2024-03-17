import React from "react";

function Home() {
  const titleStyle = {
    textAlign: 'center',
    marginTop: '1px',
    marginBottom: '20px',
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={titleStyle}>Bienvenido a nuestro sistema de licores</h1>
    </div>
  );
}

export default Home;
