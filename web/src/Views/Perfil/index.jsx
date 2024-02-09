import React from 'react';

function Profile() {

  const user = {
    name: 'Juan Pérez',
    age: 35,
    bio: 'Desarrollador web freelance. Amante de la montaña y los deportes extremos',
    city: 'Bogotá',
    country: 'Colombia'
  }

  return (
    <div className="profile">
      <h1>{user.name}</h1>

      <p>Age: {user.age}</p>

      <p>{user.bio}</p>

      <p>Location:</p>
      <p>
        {user.city}, {user.country}
      </p>

      <button>Edit Profile</button>
    </div>
  );

}

export default Profile;