import moment from "Moment";
import $ from 'jQuery';

const LOW_PRESTIGE = 5;
const LOW_MID_PRESTIGE = 10;
const MID_PRESTIGE = 15;
const MID_HIGH_PRESTIGE = 20;


var current_news = {"date": "1995-12-25", "title": "LALA", "subjectAndSubtitle": "BOO"}

export const refresh_news = (news, date, researchCompleted, prestige) => {
    if (date.isSame(moment(news[0].dates), 'day')) {
        current_news = news.shift(0)
        $("#news-headline").text(current_news.title)
        $("#news-date").text(moment(current_news.dates).format("dddd, MMMM Do YYYY"))
        $("#news-content").text(current_news.subjectAndSubtitle)
    }

    var rep_headline = "LANDMARK SUCCESS AND ACCLAIM FOR YOUNG COMPANY"
    var rep_content = 'It is truly a rare occurance when a small company achieves major attention almost overnight, yet %Company% has against the odds risen above its competitors, and seems poised to move onto the continental playing board. A steady stream of input, ideas and industry profit have all led to %Company%\'s growing influence, yet only provided the foundation for its landmark breakthrough in academia, hailed by members of the Royal Society as "a force to truly behold in its potential power and impact".'

    if (prestige < LOW_PRESTIGE) {
        rep_headline = "ASPIRING ENTREPRENEUR RECEIVES STARTING GRANT"
        rep_content = 'Many desire to be in business- few are born into it, and even fewer are given it freely. One such case, however, has presented itself, where a youth just out of university has been supplied with a £850 bursary due to the large profit obtained from their investment into agricultural mass production. The general opinion of this student is positive, though some have voiced the standard worry of their lack of proper experience in industry.'
    } else if (prestige < LOW_MID_PRESTIGE) {
        rep_headline = "PITY AND DISAPPOINTMENT SHARED ALL ROUND"
        rep_content = 'Mockery, contempt and sadness were the most common views present in the annual review of %Company% industry. Lack of profits, public and academic recognition and all-round disapproval regarding social strategy has left the company with little chance of rising out of the purported hole it seems to have dragged itself into.'
    } else if (prestige < MID_PRESTIGE) {
        rep_headline = "OVERALL DISAPPROVAL DESPITE RECOGNISING POTENTIAL IN SMALL FINDS"
        rep_content = 'Though one can see the positive findings, they unfortunately must try to overlook the more numerous flaws in the newly developed %Company%. Major finds appear to have been avoided out of fear, and the minor victories have only served to propel rivals towards the true rewards waiting.'
    } else if (prestige < MID_HIGH_PRESTIGE) {
        rep_headline = "%COMPANY% REMAINS STANDING DESPITE VICIOUS COMPETITION"
        rep_content = "Everyone knows the cruelty present in modern industry, and perhaps none better than the %Company%. Yet despite the beating many claim it has taken, the modestly made company still remains in play. Academics consider its longevity is due to its helpful contributions to society and advancements in science, though the major finding is currently a source of intense competition between it and several other companies."
    }

    $('#reputation-headline').text(rep_headline.replace("%Company", "JonnySoft"))
    $('#reputation-content').text(rep_content.replace("%Company", "JonnySoft"))


}