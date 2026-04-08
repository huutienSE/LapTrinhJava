const Home = () =>{
    return (
        <div style={styles.container}>
            <h1>Welcome to AESP 🎤🎙️</h1>
            <p>Practice your English Speaking with AI</p>

            <div style={styles.actions}>
                <a href="/speaking">Start Speaking</a>
                <a href="/history">View History</a>
            </div>
        </div>
    )
}

const styles = {
    container: {
        textAlign: "center",
        marginTop: "50px"
    }, 
    actions: {
        marginTop: "20px",
        display: "flex",
        justifyContent: "center",
        gap: "20px",
    }
}

export default Home 