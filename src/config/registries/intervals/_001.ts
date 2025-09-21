export const interval_001 = {
  interval: [
    {
      timeout: 1000,
      objs: [
        {
          is_enabled: false,
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
                "http://127.0.0.1:3003/end"
                // "http://127.0.0.1:3000/",
                // "http://127.0.0.1:4000/",
                // "http://127.0.0.1:4001/",
                // "http://127.0.0.1:4002/",
                // "http://127.0.0.1:4003/",
                // "http://127.0.0.1:4004/",
                // "http://127.0.0.1:4005/",
                // "http://127.0.0.1:4006/",
                // "http://127.0.0.1:4007/",
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