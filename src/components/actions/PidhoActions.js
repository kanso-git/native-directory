import axios from 'axios';
import * as _ from 'lodash';
import {
  RESERVATION,
  RESERVATION_NA,
  RESERVATION_EMPTY } from 'react-native-dotenv';
import * as types from './Types';
import * as queries from '../common/queriesHelper';
import * as utile from '../common/utile';
import * as logging from '../common/logging';

const courseListAxios = async (bipeId, sD, eD) => {
  const url = queries.coursesListByBipeId(bipeId, sD, eD);
  logging.info(`url courseListAxios ${url}`);
  const res = await axios.get(url);
  return res.data;
};

const sortByHeuredebutUTC = (o) => {
  const moment = utile.momentStatic;
  return moment(o.debutUTC, moment.ISO_8601).unix();
};

const formatedDataForList = (profCourse) => {
  const moment = utile.momentStatic;
  if (profCourse && profCourse.days) {
    const formattedDays = [];
    let num = 0;
    const missingDays = [];
    while (num < (utile.NBR_OF_DAYS + 1)) {
      const date = moment().add(num, 'd').format('YYYY-MM-DD');
      const missingDayIndex = _.findIndex(profCourse.days, o => o.date === date);
      if (missingDayIndex === -1) {
        missingDays.push({
          date,
          occupation: {
            date,
            dateUnix: moment().add(num, 'd').unix(),
            typeoccupation: RESERVATION_EMPTY,
            debutUTC: moment().add(num, 'd').format(moment().ISO_8601),
            debutUTCUnix: moment().add(num, 'd').unix(),
          },
        });
      }
      num += 1;
    }
    // const alldays = [...profCourse.days, ...missingDays];
    const alldays = profCourse.days;

    alldays.forEach((d) => {
      const section = d.date;
      if ((d.occupation && d.occupation.length > 0)) {
        const occupations = _.sortBy(d.occupation, [sortByHeuredebutUTC]);
        occupations.forEach((oc, i) => {
          const dateUnix = moment(oc.date, 'YYYY-MM-DD').unix();
          const debutUTCUnix = moment(oc.debutUTC, moment.ISO_8601).unix();
          if (i === 0) {
            formattedDays.push({
              ...oc, dateUnix, debutUTCUnix, section, collapsed: false,
            });
          } else {
            formattedDays.push({ ...oc, dateUnix, debutUTCUnix });
          }
        });
      } else if (_.isObject(d.occupation)) {
        const dateUnix = moment(d.occupation.date, 'YYYY-MM-DD').unix();
        const debutUTCUnix = moment(d.occupation.debutUTC, moment.ISO_8601).unix();
        formattedDays.push({
          ...d.occupation, dateUnix, debutUTCUnix, section, collapsed: false,
        });
      }
    });

    const formattedDaysSorted = _.sortBy(formattedDays, ['dateUnix']);

    return {
      ...profCourse,
      days: formattedDaysSorted.map((item, index) => ({
        ...item, type: RESERVATION, key: index, index,
      })),
    };
  }

  return profCourse;
};
const searchInProf = (prof, q) => {
  if (_.isArray(prof)) {
    const resLen = prof.filter(p => p.toLowerCase().includes(q)).length;
    return resLen > 0;
  }
  const profLowerCase = prof.toLowerCase();
  return profLowerCase.includes(q);
};
const searchInProfCours = (bipeId, searchQuery) =>
  (dispatch, getState) => {
    //  courses: {}, profCourses: {},
    const { courses, profCourses } = getState().pidho;
    const days = courses[bipeId];
    const q = searchQuery.toLowerCase();

    const filterdDays = [];
    days.forEach((d) => {
      const resInDate = d.date.includes(q);

      let resInOccupation = false;
      let resFromOcc = null;
      if (d.occupation != null) {
        if (_.isArray(d.occupation)) {
          resFromOcc = d.occupation.filter((o) => {
            const {
              matiere, profs, remarque, salle,
            } = o;
            const salleSearch = salle != null ? salle.toLowerCase().includes(q) : false;
            const remarqueSearch = remarque != null ? remarque.toLowerCase().includes(q) : false;
            return matiere.includes(q)
              || remarqueSearch || salleSearch || searchInProf(profs, q);
          });
          resInOccupation = resFromOcc && resFromOcc.length > 0;
        } else {
          const {
            matiere, profs, remarque, salle,
          } = d.occupation;
          const salleSearch = salle != null ? salle.toLowerCase().includes(q) : false;
          const remarqueSearch = remarque != null ? remarque.toLowerCase().includes(q) : false;
          resInOccupation = matiere.includes(q)
          || salleSearch || remarqueSearch || searchInProf(profs, q);
          if (resInOccupation) {
            resFromOcc = d.occupation;
          }
        }
      }
      if (resInDate) {
        filterdDays.push(d);
      } else if (resInOccupation) {
        filterdDays.push({ ...d, occupation: resFromOcc });
      }
    });

    const newProfCourses = formatedDataForList({
      ...profCourses, days: filterdDays, query: searchQuery,
    });

    dispatch({
      type: types.STORE_COURSE,
      payload: { profCourses: newProfCourses },
    });
  };

const showHideCourseDay = (bipeId, day) =>
  async (dispatch, getState) => {
    const myProfCourses = getState().pidho.profCourses;
    const days = myProfCourses.days.map((f) => {
      if (f.date === day) {
        const collapsed = !f.collapsed;
        return { ...f, collapsed };
      }
      return f;
    });
    const profCourses = { ...myProfCourses, days };
    dispatch({
      type: types.STORE_COURSE,
      payload: { profCourses },
    });
  };

const completeLoadingData = (bipeId, courseList, dispatch, getState) => {
  const { courses } = getState().pidho;
  const days = courseList.horaire.length > 0 ? courseList.horaire : [];
  courses[bipeId] = days;

  const profCourses = formatedDataForList({
    bipeId, days, query: '',
  });
  dispatch({
    type: types.STORE_COURSE,
    payload: { courses, profCourses },
  });
};

const loadCoursesbyBipeId = bipeId =>
  async (dispatch, getState) => {
    const moment = utile.momentStatic;
    const now = moment();
    const startDate = now.format('YYYY-MM-DD');
    const endDate = now.add(utile.NBR_OF_DAYS, 'd').format('YYYY-MM-DD');
    const { courses } = getState().pidho;
    try {
      const profCourseList = await courseListAxios(bipeId, startDate, endDate);
      completeLoadingData(bipeId, profCourseList, dispatch, getState);
    } catch (e) {
      const profCourses = { id: bipeId, days: [], query: '' };
      courses[bipeId] = RESERVATION_NA;
      // reducers courses: {}, profCourses: {},
      dispatch({
        type: types.STORE_COURSE,
        payload: { courses, profCourses },
      });
    }
  };

export {
  loadCoursesbyBipeId,
  showHideCourseDay,
  searchInProfCours,
};
