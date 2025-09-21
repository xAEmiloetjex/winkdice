// Timestamp format is (<mo>:<mw>:<w>:<h>:<m>:<s>)
// Where
// mo = every <month of the years corresponding to month number>
// mw = every <week of the month corresponding to week number> (THIS IS W.I.P EVERYTHING YOU PUT HERE DOESN'T AFFECT ANYTHING)
// w = every <day of the week corresponding to day number>
// h = every <hour of the day corresponding to the number (military time)>
// m = same with the minutes
// s = yeah you get the idea.. also with the seconds
// (sidenote:)
// If you want to define something to go every x amount of time instead of the timestamp match,
// then add it to the intervals, not the timestamps
// 

export const timestamp_001 = {
  timestamp: [
    {
      timestamps: [
        "0:0:0:0:0:10",
      ],
      objs: [
        {
          single: [
            // {
            //   to: "http://127.0.0.1:3000/",
            //   method: "get",
            //   data: {
            //     message: "Alibaba",
            //   },
            // },
            // {
            //   to: "http://127.0.0.1:3003/",
            //   method: "post",
            //   data: {
            //     command: {
            //       name: "sendMessage",
            //       target: "global",
            //     },
            //     body: {
            //       title: "GLOBAL MESSAGE",
            //       content: "Alibaba",
            //     },
            //   },
            // },
          ],
          multiple: [
            // {
            //   receipients: ["http://127.0.0.1:3000/", "http://127.0.0.1:3003/", "http://127.0.0.1:4000/"],
            //   method: "post",
            //   data: {
            //     id: 'cmd:ping:polling',
            //   },
            // },
            {
              receipients: [
                "http://127.0.0.1:3003/end",
                "http://127.0.0.1:4000/end",
                "http://127.0.0.1:4001/end",
                "http://127.0.0.1:4002/end",
                "http://127.0.0.1:4003/end",
                "http://127.0.0.1:4004/end",
                "http://127.0.0.1:4005/end",
                "http://127.0.0.1:4006/end",
                "http://127.0.0.1:4007/end",
              ],
              method: "post",
              data: {
                id: 'cmd:ping:polling',
              },
            },
          ],
        },
      ],
    },
  ],
};