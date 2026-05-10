[33mcommit d7ade4165c860fbada21332860cddde16bb19276[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mdevelop[m[33m)[m
Merge: b3a69b8 c01e8fb
Author: huutienSE <huutiense25@gmail.com>
Date:   Sun May 10 17:11:30 2026 +0700

    Merge remote-tracking branch 'origin/develop' into develop

[33mcommit c01e8fb18a65dffd96d55abeb52681ee8bd714f3[m[33m ([m[1;31morigin/develop[m[33m)[m
Merge: fa23327 db130ea
Author: Phan Văn Tiến <tienpv7888@ut.edu.vn>
Date:   Sun May 10 17:11:27 2026 +0700

    Merge pull request #36 from huutienSE/feature/Assessmentfixed
    
    Refactor `AssessmentServiceImpl` to clean up imports and simplify int…

[33mcommit db130ea62778c5ba9214a7dcc804c4eb5408b78f[m[33m ([m[1;31morigin/feature/Assessmentfixed[m[33m)[m
Author: Phan Văn Tiến <tienpv7888@ut.edu.vn>
Date:   Sun May 10 17:10:27 2026 +0700

    Refactor `AssessmentServiceImpl` to clean up imports and simplify interface implementation

[33mcommit b3a69b84d4c3fc5d5f2a3463b1ed1b3d321e7a82[m
Merge: 20537a9 fa23327
Author: huutienSE <huutiense25@gmail.com>
Date:   Sun May 10 17:05:40 2026 +0700

    complete assessment

[33mcommit 20537a9279d14e8f5a4b392387d579a943b4be94[m
Author: huutienSE <huutiense25@gmail.com>
Date:   Sun May 10 17:03:56 2026 +0700

    comment assessment file

[33mcommit fa23327418c957785cb3f7a27eef0ed73e980083[m
Merge: b3fa81c 15f5bbd
Author: Huynh Pham Huu Tien <huutiense25@gmail.com>
Date:   Sun May 10 17:02:44 2026 +0700

    Merge pull request #35 from huutienSE/feature/Assessmentfixed
    
    Refactor database schema and improve assessment features

[33mcommit 15f5bbdbefa62460916cedcac414243a4c295642[m
Author: Phan Văn Tiến <tienpv7888@ut.edu.vn>
Date:   Sun May 10 17:00:33 2026 +0700

    Refactor SQL scripts for consistency and clarity:
    - Simplify table definitions by standardizing formatting and removing redundant constraints.
    - Add `session_id` column to `assessment` table and modify relationships.
    - Adjust seed data for improved accuracy and consistency.
    - Update indices for better query optimization.

[33mcommit 1a5e04847d9e08b3d2abf6d796a4c90083e7e9a2[m
Author: Phan Văn Tiến <tienpv7888@ut.edu.vn>
Date:   Sun May 10 16:58:59 2026 +0700

    Refactor SQL scripts for consistency and clarity:
    - Simplify table definitions by standardizing formatting and removing redundant constraints.
    - Add `session_id` column to `assessment` table and modify relationships.
    - Adjust seed data for improved accuracy and consistency.
    - Update indices for better query optimization.

[33mcommit 8d5c1c9339b30c49bf28e588964584f411ba5243[m
Author: Phan Văn Tiến <tienpv7888@ut.edu.vn>
Date:   Sun May 10 16:52:55 2026 +0700

    Refactor database schema and assessment logic:
    - Update assessment table structure (add session_id, modify constraints).
    - Remove redundant columns and values in seed data.
    - Adjust table relationships and indices for better consistency.
    - Update `Assessment` entity for one-to-one mapping with practice sessions.

[33mcommit 9c0e1f3069a68b8f29604b291afbee0b821a5b53[m
Author: Phan Văn Tiến <tienpv7888@ut.edu.vn>
Date:   Sun May 10 13:56:49 2026 +0700

    fix practice question feature and add view history assessment endpoint

[33mcommit 1d9447aa40446a7b1dd9b7efa1ac37098dabcf4e[m
Author: Phan Văn Tiến <tienpv7888@ut.edu.vn>
Date:   Sun May 10 13:56:31 2026 +0700

    fix practice question feature and add view history assessment endpoint

[33mcommit 0b32ae6e7aab0ce1702c94fa87cf63be382ac06f[m
Merge: eb8822b b3fa81c
Author: Phan Văn Tiến <tienpv7888@ut.edu.vn>
Date:   Sat May 9 14:05:58 2026 +0700

    Merge remote-tracking branch 'origin/develop' into develop

[33mcommit 111125755141401944fad7728df4b7d562255548[m
Author: huutienSE <huutiense25@gmail.com>
Date:   Sat May 9 13:56:17 2026 +0700

    chore: add application-example- properties

[33mcommit 5476edf18c7ea29c4193a8f78f89343ffc2fd3e2[m
Merge: 66e1e08 b3fa81c
Author: huutienSE <huutiense25@gmail.com>
Date:   Sat May 9 13:47:26 2026 +0700

    fix: duplicate name

[33mcommit 66e1e0823a910f4c8a834a473cb326959c8b3e96[m
Author: huutienSE <huutiense25@gmail.com>
Date:   Sat May 9 13:33:08 2026 +0700

    chore: TopicNotFoundException and PracticeService file

[33mcommit b3fa81cfcec4beb9bfd5c6b5d2ecd5a586943f46[m
Merge: e6d3043 2a4931f
Author: nhanhehehe <bengame2006@gmail.com>
Date:   Fri May 8 16:35:15 2026 +0700

    Merge pull request #31 from huutienSE/feature/frontend/view-history-and-detailed-session
    
    Feature/frontend/view history and detailed session

[33mcommit 2a4931f089f723ded4a52db9119711cff2855c93[m[33m ([m[1;31morigin/feature/frontend/view-history-and-detailed-session[m[33m)[m
Author: nhanhehehe <bengame2006@gmail.com>
Date:   Fri May 8 16:31:33 2026 +0700

    bullshit cua Tien

[33mcommit 2126f2155a2169a324ecca647df176a4bb110c8c[m
Author: nhanhehehe <bengame2006@gmail.com>
Date:   Fri May 8 16:25:27 2026 +0700

    frontend for view detail history page

[33mcommit 047d5b2383f5190a1376bd7188957ec99d785e1c[m
Author: nhanhehehe <bengame2006@gmail.com>
Date:   Fri May 8 16:25:09 2026 +0700

    frontend for view detail history page

[33mcommit 55737eccbd7b6df30773fdc8668b33c40a7bff02[m
Author: nhanhehehe <bengame2006@gmail.com>
Date:   Fri May 8 16:13:16 2026 +0700

    extract exact payload for register

[33mcommit 3b70044b377f08ba98e9bd3f7bb5f046284b24b3[m
Author: nhanhehehe <bengame2006@gmail.com>
Date:   Fri May 8 16:08:33 2026 +0700

    adjust login page and register page need permit and do later

[33mcommit 2f23879028bf31177634aa40e54ba6ad9f56f342[m
Author: nhanhehehe <bengame2006@gmail.com>
Date:   Fri May 8 15:34:59 2026 +0700

    adjust configure for connecting to frontend and backend

[33mcommit e6d30433b82baf73670c910445ef05a7a6cfb367[m
Merge: 7968186 e6d90fd
Author: nhanhehehe <bengame2006@gmail.com>
Date:   Fri May 8 10:25:07 2026 +0700

    Merge pull request #30 from huutienSE/feature/get-practice-history-detailed-session
    
    Feature/get practice history detailed session

[33mcommit e6d90fd70b16fc44d9f7de54954ef2eac5a81321[m[33m ([m[1;31morigin/feature/get-practice-history-detailed-session[m[33m)[m
Author: nhanhehehe <bengame2006@gmail.com>
Date:   Thu May 7 23:23:39 2026 +0700

    restore assessment for Tien

[33mcommit 619f28c269a7a81e388121fa9a946aa2889ad5b0[m
Author: nhanhehehe <bengame2006@gmail.com>
Date:   Thu May 7 23:14:21 2026 +0700

    adjust 2 exception handler for session and user permitted allow

[33mcommit 8ed9c714be4210c6e982cc2a78f2f4e99532d42b[m
Author: nhanhehehe <bengame2006@gmail.com>
Date:   Thu May 7 19:45:30 2026 +0700

    get detail session and history with jwt

[33mcommit 9887c1e78cb96a8e624e9c8e8c33fd03a57b08cf[m
Author: nhanhehehe <bengame2006@gmail.com>
Date:   Thu May 7 18:30:50 2026 +0700

    get detail session without jwt

[33mcommit ef3df32a9a4984f34b041aed8fe838bb3a303516[m
Author: nhanhehehe <bengame2006@gmail.com>
Date:   Wed May 6 01:48:38 2026 +0700

    adding service

[33mcommit 134cf08157c7fc5eaa76d4baab61f516c956b0c8[m
Author: nhanhehehe <bengame2006@gmail.com>
Date:   Tue May 5 18:58:13 2026 +0700

    adding service

[33mcommit b14105c6db2d8ca470c1d4d7907561e78743c8f8[m
Author: nhanhehehe <bengame2006@gmail.com>
Date:   Tue May 5 18:11:17 2026 +0700

    init new feature

[33mcommit a9a84c487192716a020c4bfb4ef4e54b78115639[m
Author: nhanhehehe <bengame2006@gmail.com>
Date:   Tue May 5 17:44:57 2026 +0700

    get history with jwt

[33mcommit f5cba77f130bdd1437d967741b2893b4ac486da7[m
Author: nhanhehehe <bengame2006@gmail.com>
Date:   Tue May 5 15:41:42 2026 +0700

    adding attribute for sessionId in PracticeServiceImpl

[33mcommit cd0ca7d93a43b0c5d2afe006d4fdc9c6b4d3b38a[m
Author: nhanhehehe <bengame2006@gmail.com>
Date:   Tue May 5 02:48:02 2026 +0700

    delete excessive code

[33mcommit f0613a867a87bd453c3d6288cec12a5607674f8e[m
Author: nhanhehehe <bengame2006@gmail.com>
Date:   Tue May 5 02:45:54 2026 +0700

    get practice history

[33mcommit c0a5a1552ba6095cfa94528d24a1b7d796053eb7[m[33m ([m[1;31morigin/feature/get-topic-questions