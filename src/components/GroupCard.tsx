import React from "react"

function GroupCard() {
    return (
        <div // Group Card Div
            id="groupCardDiv"
            style={{
                backgroundColor: "#FDF7F4",
                height: "250px",
                width: "420px",
                display: "flex",
                alignItems: "center",      // centers vertically
                justifyContent: "space-evenly",   
                borderRadius: "12px",      // rounds the corners
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"  // adds a gray shadow
            }}
        >

            {/* Image Div */}
            <div
                id="groupCardImageDiv"
                style={{
                    width: "128px",
                    height: "128px",
                    borderRadius: "25%",
                }}
            >
                {/* Group Card Image*/}
                <img
                    id="groupCardImage"
                    src="/JohnPork.png"
                    style={{
                        width: "128px",
                        height: "128px",
                        borderRadius: "25%"
                    }}
                    alt="ProfilePicture"
                />
                {/* End Group Card Image*/}
            
            </div> {/* End Image Div */}

            {/* Group Name and Text */}
            <div
                id="groupNameAndTextDiv"
                style={{
                    width: "169px",
                    height: "204px"
                }}
            >
                    {/* Group Card Name */}
                    <p
                        id="groupCardName"
                        style={{
                            color: '#424242',
                            fontFamily: 'Arial',
                            fontWeight: 'bold',
                            fontSize: '24px',
                        }}
                    >
                        Group Name
                    </p>
                    
                    {/* Group Card Text */}
                    <p
                        id="groupCardText"
                        style={{
                            color: '#424242',
                            fontFamily: 'Arial',
                            fontSize: '18px',
                        }}
                    >
                        This tells the user what is going on. What should the character limit be?
                    </p>

                </div>
                {/* End Group Name and Text Div */}

        </div> // End Group Card Div
    );
}

export default GroupCard;