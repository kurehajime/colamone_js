import i18n from "i18next"
import { initReactI18next } from "react-i18next"

// 言語jsonファイルのimport
import translation_en from "./en.json"
import translation_de from "./de.json"
import translation_ja from "./ja.json"
import translation_hi from "./hi.json"
import translation_kr from "./kr.json"
import translation_pt from "./pt.json"
import translation_zh_hans from "./zh-hans.json"
import translation_zh_hant from "./zh-hant.json"
import { Util } from "../static/Util"

const resources = {
    ja: {
        translation: translation_ja
    },
    en: {
        translation: translation_en
    },
    de: {
        translation: translation_de
    },
    hi: {
        translation: translation_hi
    },
    kr: {
        translation: translation_kr
    },
    pt: {
        translation: translation_pt
    },
    zhhans: {
        translation: translation_zh_hans
    },
    zhhant: {
        translation: translation_zh_hant
    }
}

i18n
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        resources,
        lng: Util.getLang(),
        interpolation: {
            escapeValue: false
        }
    })

export default i18n