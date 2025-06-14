import React from "react";

const UserCard = ({ user, buttons }) => {
  const { firstName, lastName, imgUrl, about, age, gender } = user;
  return (
    <div className="card bg-gradient-to-br from-gray-800 to-gray-900 w-96 shadow-sm">
      <figure>
        <img src={imgUrl} alt="profile-img" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {firstName} {lastName}
        </h2>
        {age && gender && (
          <p>
            {age}, {gender}
          </p>
        )}
        <p>{about}</p>
        {buttons && (
          <div className="card-actions justify-center">
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={`btn ${button.className || "btn-primary"}`}
              >
                {button.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
