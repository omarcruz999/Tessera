import React from "react";
import PeerCard from '../components/PeerCard.tsx'
import GroupCard from "./GroupCard.tsx";

function HomeView() {
    return (

        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)", // Four equal columns
                gap: "16px",
                padding: "16px"
            }}
        >
            {/* Row 1: 4 peer cards */}
            <div style={{ gridRow: "1", gridColumn: "1" }}>
                <PeerCard />
            </div>
            <div style={{ gridRow: "1", gridColumn: "2" }}>
                <PeerCard />
            </div>
            <div style={{ gridRow: "1", gridColumn: "3" }}>
                <PeerCard />
            </div>
            <div style={{ gridRow: "1", gridColumn: "4" }}>
                <PeerCard />
            </div>

            {/* Row 2: 1 peer card, 1 group card, 1 peer card */}
            <div style={{ gridRow: "2", gridColumn: "1" }}>
                <PeerCard />
            </div>
            {/* Make the group card span two columns (columns 2-3) */}
            <div style={{ gridRow: "2", gridColumn: "2 / span 2" }}>
                <GroupCard />
            </div>
            <div style={{ gridRow: "2", gridColumn: "4" }}>
                <PeerCard />
            </div>

            {/* Row 3: 1 group card, 2 peer cards */}
            {/* Group card spanning two columns (columns 1-2) */}
            <div style={{ gridRow: "3", gridColumn: "1 / span 2" }}>
                <GroupCard />
            </div>
            <div style={{ gridRow: "3", gridColumn: "3" }}>
                <PeerCard />
            </div>
            <div style={{ gridRow: "3", gridColumn: "4" }}>
                <PeerCard />
            </div>

            {/* Row 4: 2 group cards */}
            {/* First group card spans columns 1-2 */}
            <div style={{ gridRow: "4", gridColumn: "1 / span 2" }}>
                <GroupCard />
            </div>
            {/* Second group card spans columns 3-4 */}
            <div style={{ gridRow: "4", gridColumn: "3 / span 2" }}>
                <GroupCard />
            </div>
        </div>

    )
}

export default HomeView;