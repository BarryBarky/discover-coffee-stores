import Document, {Html, Main, NextScript, Head} from "next/document";

class myDocument extends Document {
    render(){
        return (
            <Html lang={'en'}>
            <Head>
                <link rel="preload" href="/IBM_Plex_Sans/IBMPlexSans-Bold.ttf" as={"font"} crossOrigin={"anonymous"}/>
                <link rel="preload" href="/IBM_Plex_Sans/IBMPlexSans-Regular.ttf" as={"font"} crossOrigin={"anonymous"}/>
                <link rel="preload" href="/IBM_Plex_Sans/IBMPlexSans-semibold.ttf" as={"font"} crossOrigin={"anonymous"}/>
            </Head>
            <body>
                <Main></Main>
                <NextScript/>
            </body>
            </Html>
            )
    }
}

export default myDocument