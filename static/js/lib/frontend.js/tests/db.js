import * as fs from "node:fs";
import { DB } from "..";
const db = new DB.db();
db.set('a.b.c.d.e.f.g.h.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z', 0);
fs.writeFileSync('results/db.test.json', JSON.stringify(db.data.all()), 'utf8');
