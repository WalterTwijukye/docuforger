async function test() {
    console.log("Fetching Store API for 305474...");
    const req = await fetch("https://api.lemonsqueezy.com/v1/stores/305474", {
        headers: {
            "Accept": "application/vnd.api+json",
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NGQ1OWNlZi1kYmI4LTRlYTUtYjE3OC1kMjU0MGZjZDY5MTkiLCJqdGkiOiIxZmJkNmZhZGE2NzQ0MTA5NTEyODI0ODE4YWYyMDZhNmY4ZGNmMTgwZDAzNDNkMDNmZWU4N2IxYjJiYTNkMjNkMTNkNjQ0M2EyZTk2MTkwZCIsImlhdCI6MTc3MjUyMzU5MC4xNDUwMTIsIm5iZiI6MTc3MjUyMzU5MC4xNDUwMTUsImV4cCI6MTc4ODM5MzYwMC4wNDM5MTcsInN1YiI6IjY2MzA4NzAiLCJzY29wZXMiOltdfQ.nEy1OfFJLLsNrJDi4_3YvsUefi1YZmm_Z1_YCyfYVG6JDHp_pGmI0VyE6g4xS75y8susXz65g1wamJV0ta8b1ISuj2oiqY1IBm0JPTizMIVy09QShCu_Ixg9lXDR6CKGn7bM0yHU17XJkkAdkuBzK7J48UJWEckd2vhmIUZtj8hdpnVaU80FFjk-XOMYpeiM6P6b3zLOcuxYss3gKTck1tSdtqoHjqN1Z0l-SZOZXIROb8pXHZzh9oN0wFg4PPY4B_1IBIBk7EkbY-a2TRYN_n-iT3bGnoYjQ8nGywZCm6B7I1yCbA6hWLeRYtYVlu7ebC5l9uc1dk-hm9QO4pbrUmdFxkk2fGpw4ZptQi2Waf4jSk6fin_aVfBjGWpw2G-O6JgLzzHIc4eWPoWX4j9YwA4WiGkkWDHZjKgQ8rvh9dklbPY0wJ0rGxd8aEstUZMvZAgCaxAhUfbK-dfQhQ2V6XNQqGhd6tVZ_ZK2uFE0OHvCBbK6RXqtq7i04yASqRukYGtpJqDl3U-Ft54qaRucP_XIPYw_E-fDpkyUPBenDHmpEPWlNwi981MjiL_g90bu3qxuu1qbqfYoSiBAbsD2ETptR2nGTvKlBV6GvbURGA8kqHNxISn2tn9u3lS1WLqQPJhedekxljghKPXFbEBcqt6oCd4fMtb5HtMv208-F58"
        }
    });

    const res = await req.json();
    console.log(JSON.stringify(res, null, 2));
}

test();
