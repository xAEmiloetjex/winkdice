import * as fs from "node:fs";
import { pipeline } from "node:stream/promises";

import { each } from "../Each";
import { Logger } from "../logger";
import { fMap, DB } from "..";
import { common } from "../core/utils";
import { constants_1 } from "../core/types";

import * as gzip from "node:zlib";

const db = new DB.db()

db.set('a.b.c.d.e.f.g.h.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z', 0)

fs.writeFileSync('results/db.test.json', JSON.stringify(db.data.all()), 'utf8')