export default function Footer() {
    return (<div id="footer">
        <p>
            {'(c)2014–' + new Date().getFullYear().toString()}   <a
                href="https://twitter.com/kurehajime">@kurehajime</a>. All Rights Reserved. / Ver.<a
                    href="https://github.com/kurehajime/colamone_js">
                {import.meta.env.VITE_BUILD_DATE}
            </a>/<span id="time"></span>
        </p>
    </div>)
}