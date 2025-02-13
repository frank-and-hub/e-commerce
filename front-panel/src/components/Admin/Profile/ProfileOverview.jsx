import React from 'react'

function ProfileOverview({ user }) {

    const UserData = {
        'Name': user?.name,
        'Phone': user?.phone,
        'Email': user?.email,
        'Gender': user?.gender,
        'Address': user?.address,
        'City': user?.city,
        'State': user?.state,
        'Zip Code': user?.zipcode
    };
    return (
        <>
            <h5 className="card-title">About</h5>
            <p className="small fst-italic">{user?.about}</p>

            <h5 className="card-title">Profile Details</h5>

            {Object.entries(UserData).map(([key, value], index) => (
                <div className={`row`} key={index}>
                    <div className="col-lg-3 col-md-4 label text-start">{key}</div>
                    <div className="col-lg-9 col-md-8 text-start">{value}</div>
                </div>
            ))}
        </>
    )
}

export default ProfileOverview