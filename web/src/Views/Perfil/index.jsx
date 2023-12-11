import React from 'react';

const UserProfileForm = () => {
  return (
    <form className="">
      <div className="row">
        <div className="pr-md-1 col-md-5">
          <div className="form-group">
            <label>Company (disabled)</label>
            <input
              disabled
              placeholder="Company"
              type="text"
              className="form-control"
              value="Creative Code Inc."
            />
          </div>
        </div>
        <div className="px-md-1 col-md-3">
          <div className="form-group">
            <label>Username</label>
            <input
              placeholder="Username"
              type="text"
              className="form-control"
              value="michael23"
            />
          </div>
        </div>
        <div className="pl-md-1 col-md-4">
          <div className="form-group">
            <label>Email address</label>
            <input
              placeholder="mike@email.com"
              type="email"
              className="form-control"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="pr-md-1 col-md-6">
          <div className="form-group">
            <label>First Name</label>
            <input
              placeholder="Company"
              type="text"
              className="form-control"
              value="Mike"
            />
          </div>
        </div>
        <div className="pl-md-1 col-md-6">
          <div className="form-group">
            <label>Last Name</label>
            <input
              placeholder="Last Name"
              type="text"
              className="form-control"
              value="Andrew"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label>Address</label>
            <input
              placeholder="Home Address"
              type="text"
              className="form-control"
              value="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="pr-md-1 col-md-4">
          <div className="form-group">
            <label>City</label>
            <input
              placeholder="City"
              type="text"
              className="form-control"
              value="Mike"
            />
          </div>
        </div>
        <div className="px-md-1 col-md-4">
          <div className="form-group">
            <label>Country</label>
            <input
              placeholder="Country"
              type="text"
              className="form-control"
              value="Andrew"
            />
          </div>
        </div>
        <div className="pl-md-1 col-md-4">
          <div className="form-group">
            <label>Postal Code</label>
            <input
              placeholder="ZIP Code"
              type="number"
              className="form-control"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <div className="form-group">
            <label>About Me</label>
            <textarea
              cols="80"
              placeholder="Here can be your description"
              rows="4"
              className="form-control"
              data-gramm="false"
              wt-ignore-input="true"
            >
              Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo.
            </textarea>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <button className="btn btn-primary">Editar Perfil</button>
        </div>
      </div>
    </form>
  );
};

export default UserProfileForm;
