import Substitute from "../../substitute"
import Announcement from "../../announcement";

export function deserialize(json: any): [Date, Announcement, Substitute[], any[]] {
    const datumStr = json["Datum"] as string
    const date = new Date(datumStr);

    let announcementText = json["Hinweise"] as string;
    if (announcementText.trim() == "keine") {
        announcementText = "";
    }
    const announcement = new Announcement(date, announcementText)

    const stunden = json["Stunden"] as Array<any>;
    const substitutes = new Array<Substitute>();
    for (let stunde of stunden) {
        substitutes.push(deserializeSubstitute(date, stunde))
    }

    const aufsichten = json['Aufsichten'] as Array<any>;

    return [date, announcement, substitutes, aufsichten];
}

function deserializeSubstitute(date: Date, jsonObject: any): Substitute {
    let subjectAbbr = parseHtml((jsonObject["Fach"] as string).trim());
        if (subjectAbbr == "---") {
            subjectAbbr = "";
        }
    //let subject = resolver.resolveSubject(subjectAbbr);
    const subject = subjectAbbr;
    let _class = parseHtml((jsonObject["Klasse"] as string).trim())
    if (_class == "---") {
        _class = "";
    }
    let teacherAbbr = parseHtml((jsonObject["Lehrer"] as string).trim());
    if (teacherAbbr == "---") {
        teacherAbbr = "";
    }
    //let teacher = resolver.resolveTeacher(teacherAbbr);
    const teacher = teacherAbbr;
    let substituteAbbr = parseHtml((jsonObject["Vertretungslehrer"] as string).trim());
    if (substituteAbbr == "---") {
        substituteAbbr = "";
    }
    //let substitute = resolver.resolveTeacher(substituteAbbr);
    const substitute = substituteAbbr;
    const hint = parseHtml((jsonObject["Hinweis"] as string).trim());
    let room = parseHtml((jsonObject["Raum"] as string).trim());
    if (room == "---") {
        room = "";
    }
    const isRelevant = (jsonObject["relevant"] as string).toLowerCase() == "true";

    //Bindestrich workaround
    const beginStr = (jsonObject["Stundeanfang"] as string).replace("-","").trim();
    const begin = parseInt(beginStr);
    const endStr = (jsonObject["Stundeende"] as string).replace("-","").trim();
    const end = parseInt(endStr);

    return new Substitute(date, begin, (end - begin) + 1, subject, _class, teacher, substitute, room, hint, isRelevant);
}

const domParser = new DOMParser();
function parseHtml(text: string): string {
    const dom = domParser.parseFromString('<!doctype html><body>'+text, 'text/html');
    return dom.body.textContent ? dom.body.textContent : '';
}