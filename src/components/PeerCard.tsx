import React from "react";

function PeerCard() {
    return (

        <div // Peer Card Div
            id="peerCardDiv"
            style={{
                backgroundColor: "#FDF7F4",
                height: "250px",
                width: "200px",
                display: "flex",
                alignItems: "center",      // centers vertically
                justifyContent: "center",   // centers horizontally
                borderRadius: "12px",      // rounds the corners
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"  // adds a gray shadow
            }}
        >

            {/* Image Div */}
            <div
                id="peerCardImageDiv"
                style={{
                    width: "128px",
                    height: "128px",
                    borderRadius: "50%",
                    transform: "translateY(-40px)"  // shifts the circle 40px upward
                }}
            >
                {/* Peer Card Image*/}
                <img
                    id="peerCardImage"
                    src="/JohnPork.png"
                    style={{
                        width: "128px",
                        height: "128px",
                        borderRadius: "50%"
                    }}
                    alt="ProfilePicture"
                />

                {/* Peer Card Name */}
                <p
                    id="peerCardName"
                    style={{
                        color: '#424242',
                        fontFamily: 'Arial',
                        fontWeight: 'bold',
                        fontSize: '24px',
                        marginTop: '8px'
                    }}
                >
                    Joseph Schmo
                </p>
            </div>
            {/* End Image Div */}

        </div> // End Peer Card Div
    );
}

export default PeerCard;
