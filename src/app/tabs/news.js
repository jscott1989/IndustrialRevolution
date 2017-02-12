import moment from "Moment";
import $ from 'jQuery';

var current_news = {"date": "1995-12-25", "title": "LALA", "subjectAndSubtitle": "BOO"}

export const refresh_news = (news, date, researchCompleted, prestige) => {
    if (date.isSame(moment(news[0].dates), 'day')) {
        current_news = news.shift(0)
        $("#news-headline").text(current_news.title)
        $("#news-date").text(moment(current_news.dates).format("dddd, MMMM Do YYYY"))
        $("#news-content").text(current_news.subjectAndSubtitle)
    }
}