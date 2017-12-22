
// ***** GUIDE *****
// type: 'duration',
// duration: {
//     from: new Date('2017-12-01 00:00:00'),
//     to: new Date('2017-12-02 00:00:00')
// }
// type: 'days',
// days: [ '2017-11-30', '2017-12-30' ]
// ***** GUIDE *****

const CONDITION = {
    type: 'duration',
    duration: {
        from: new Date('2017/12/12 00:00:00'),
        to: new Date('2017/12/31 00:00:00')
    }
};

const isBigCampaign = ({ type, duration, days }: any) => {
    switch (type) {
        case 'duration':
            return duration.from.getTime() < new Date().getTime() && new Date().getTime() < duration.to.getTime();

        case 'days':
            return days.some((day: string) => new Date().toISOString().indexOf(day) === 0);

        default:
            return false;
    }
};

export default isBigCampaign(CONDITION);
