import {renderComponent, expect} from '../test_helper';
import App from '../../src/app/components/app';
import FireBaseTools from '../../src/app/utils/firebase';

describe('fillNoClassThisDay', () => {
  let noClassThisDay = new Array();
  FireBaseTools.fillNoClassThisDay(noClassThisDay);

  it('expect array', () => {
    expect(noClassThisDay).to.be.a('array');
  });
  it('fill', () => {
      expect(noClassThisDay.length).greaterThan(0);
  });
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

  it('check weekday', () => {
    expect(FireBaseTools.checkWeekday(startDate, endDate, snap)).to.not.exist;
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

  it('populate timetable', () => {
    expect(timeTable).to.exist;
  });
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
  
  it('date exists', () => {
    expect(returnDate).to.exist;
  });
  it('date object', () => {
      expect(returnDate).to.be.an('object');
  });
});
