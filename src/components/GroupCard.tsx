function GroupCard() {
    return (
        <div // Group Card Div
            id="groupCardDiv"
            style={{
                backgroundColor: "#FDF7F4",
                height: "250px",
                width: "420px",
                display: "flex",
                alignItems: "center",      
                justifyContent: "space-evenly",   
                borderRadius: "12px",      
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"  
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
                            display: "-webkit-box",          
                            WebkitBoxOrient: "vertical",      
                            WebkitLineClamp: 1,               
                            overflow: "hidden"   
                        }}
                    >
                        Group name This is to test the overflow
                    </p>
                    
                    {/* Group Card Text */}
                    <p
                        id="groupCardText"
                        style={{
                            color: '#424242',
                            fontFamily: 'Arial',
                            fontSize: '18px',
                            display: "-webkit-box",          
                            WebkitBoxOrient: "vertical",      
                            WebkitLineClamp: 4,               // Limit of allowed lines
                            overflow: "hidden"                
                        }}
                    >
                        This tells the user what is going on. What should the character limit be? This is to test the overflow
                    </p>

                </div>
                {/* End Group Name and Text Div */}

        </div> // End Group Card Div
    );
}

export default GroupCard;