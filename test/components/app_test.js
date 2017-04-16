import {renderComponent, expect} from '../test_helper';
import App from '../../src/app/components/app';
import FireBaseTools from '../../src/app/utils/firebase';

describe('fillNoClassThisDay', () => {
  let noClassThisDay = new Array();
  FireBaseTools.fillNoClassThisDay(noClassThisDay);
  // Expect the noClassThisDay to be an array
  it('expect array', () => {
    expect(noClassThisDay).to.be.a('array');
  });
  // Expect the noClassThisDay array to be greater than 0
  it('fill', () => {
      expect(noClassThisDay.length).greaterThan(0);
  });
  // Expect the noClassThisDay array to equal 11.
  it('number of days', () => {
    expect(noClassThisDay.length).equals(11);
  });
});

describe('Weekdays', () => {
  let startDate = new Date(2017, 1, 9);
  let endDate = new Date(2017, 4, 13);
  let noClassThisDay = new Array();
  FireBaseTools.fillNoClassThisDay(noClassThisDay);
  let val = () => { return {
      'COMP346Y YA': {
      'Term': 2164,
      'Subject': 'COMP',
      'Catalog': 346,
      'Section': 'Y YA',
      'Component': 'TUT',
      'Pat Nbr': 1,
      'Room Nbr': '',
      'Mtg Start': '8:30:00 AM',
      'Mtg End': '9:20:00 AM',
      'Mon': 'N',
      'Tues': 'Y',
      'Wed': 'N',
      'Thurs': 'N',
      'Fri': 'N',
      'Sat': 'N',
      'Sun': 'N',
      'Start Date': '2017-01-09',
      'End Date': '2017-04-13',
      'Last': 'Goswami',
      'First Name': 'Dhrubajyoti',
      'Email': 'dhrubajyoti.goswami@concordia.ca'
      }
    };
  }; 
  let snap = {val: val};
  let timeTable = FireBaseTools.populate(startDate, endDate, noClassThisDay, snap);
  FireBaseTools.checkWeekday(startDate, timeTable, snap);
  /* eslint-disable */
  const monthNumber = startDate.getMonth() < 9 ? '0' + (startDate.getMonth() + 1) : (startDate.getMonth() + 1);
  const dateNumber = startDate.getDate() < 10 ? '0' + (startDate.getDate()) : (startDate.getDate());
  const newDateObject = startDate.getFullYear() + '-' + monthNumber + '-' + dateNumber;
  /* eslint-enable */

  // Checks if classes are scheduled to run on Tuesdays
  it('check weekday', () => {
    expect(timeTable[newDateObject].description).to.equal('No Description');
  });
});

describe('populate', () => {
  let startDate = new Date(2017, 1, 9);
  let endDate = new Date(2017, 4, 13);
  let noClassThisDay = new Array();
  FireBaseTools.fillNoClassThisDay(noClassThisDay);
  let val = () => { return {
      'COMP346Y YA': {
      'Term': 2164,
      'Subject': 'COMP',
      'Catalog': 346,
      'Section': 'Y YA',
      'Component': 'TUT',
      'Pat Nbr': 1,
      'Room Nbr': '',
      'Mtg Start': '8:30:00 AM',
      'Mtg End': '9:20:00 AM',
      'Mon': 'N',
      'Tues': 'Y',
      'Wed': 'N',
      'Thurs': 'N',
      'Fri': 'N',
      'Sat': 'N',
      'Sun': 'N',
      'Start Date': '2017-01-09',
      'End Date': '2017-04-13',
      'Last': 'Goswami',
      'First Name': 'Dhrubajyoti',
      'Email': 'dhrubajyoti.goswami@concordia.ca'
      }
    };
  };
  let snap = {val: val};
  let timeTable = FireBaseTools.populate(startDate, endDate, noClassThisDay, snap);

  // Expects a timetable to exist.
  it('populate timetable', () => {
    expect(timeTable).to.exist;
  });
  // Expects a timetable to be an object
  it('timetable object', () => {
      expect(timeTable).to.be.an('object');
  });
});

describe('setDateEvents', () => {

  let course = {
      'COMP346Y YA': {
      'Term': 2164,
      'Subject': 'COMP',
      'Catalog': 346,
      'Section': 'Y YA',
      'Component': 'TUT',
      'Pat Nbr': 1,
      'Room Nbr': '',
      'Mtg Start': '8:30:00 AM',
      'Mtg End': '9:20:00 AM',
      'Mon': 'N',
      'Tues': 'Y',
      'Wed': 'N',
      'Thurs': 'N',
      'Fri': 'N',
      'Sat': 'N',
      'Sun': 'N',
      'Start Date': '2017-01-09',
      'End Date': '2017-04-13',
      'Last': 'Goswami',
      'First Name': 'Dhrubajyoti',
      'Email': 'dhrubajyoti.goswami@concordia.ca'
      }
    };

    let date = {};
    let returnDate = FireBaseTools.setDateEvents(course, date);
  
  // Expect the date object to exist.
  it('date exists', () => {
    expect(returnDate).to.exist;
  });
  // Expect the date to be an object.
  it('date object', () => {
      expect(returnDate).to.be.an('object');
  });
});
