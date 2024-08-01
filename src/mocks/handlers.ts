import { http, HttpResponse } from "msw";

const musics = [
  "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
  "https://www2.cs.uic.edu/~i101/SoundFiles/Fanfare60.wav",
  "https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther30.wav",
  "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav",
];

let intervalCounter = 0;

export const handlers = [
  http.get<never, never, string>("/api/test", () => {
    return HttpResponse.json("msw test");
  }),
  // http.get("/api/music/:id", ({ params }) => {
  //   const { id } = params;
  //   const idx = Number(id) - 1;
  //   if (musics[idx] == undefined) {
  //     return HttpResponse.error();
  //   }

  //   return HttpResponse.json({ src: musics[idx] });
  // }),
  // http.post<never, never, { id: string }>(
  //   "/api/music/create",
  //   async ({ request }) => {
  //     const data = await request.json();
  //     console.log(data);
  //     // const { singerGender } = await request.json();
  //     // if (singerGender === "남자") {
  //     //   return HttpResponse.json(null, { status: 404 });
  //     // }

  //     return HttpResponse.json({ id: "test-song-id" });
  //   },
  // ),

  // http.get<never, never, { id: string; musicUrl: string }>(
  //   "/api/music/create",
  //   ({ request }) => {
  //     const url = new URL(request.url);
  //     const id = url.searchParams.get("id");
  //     if (intervalCounter < 3) {
  //       intervalCounter++;
  //       return HttpResponse.json(null, { status: 404 });
  //     }
  //     return HttpResponse.json({ id: "test-song-id", musicUrl: musics[0] });
  //   },
  // ),

  // http.get<never, never, never>("/api/duplicate", ({ request }) => {
  //   const url = new URL(request.url);

  //   const nickName = url.searchParams.get("nickName");

  //   if (nickName === "중복") {
  //     return HttpResponse.json(null, { status: 200 });
  //   }

  //   return HttpResponse.json(null, { status: 404 });
  // }),

  // http.post<never, { nickName: string; password: string }, never>(
  //   "/api/signup",
  //   async ({ request }) => {
  //     const { nickName, password } = await request.json();

  //     if (nickName === "에러") {
  //       return HttpResponse.json(null, { status: 401 });
  //     }

  //     return HttpResponse.json(null, { status: 200 });
  //   },
  // ),
  //   http.get<never, never, User>('https://api.example.com/user', () => {
  //     return HttpResponse.json({
  //       firstName: 'Sarah',
  //       lastName: 'Maverick',
  //     })
  //   }),
  //   graphql.query<{ movies: Array<Movie> }>('ListMovies', () => {
  //     return HttpResponse.json({
  //       data: {
  //         movies: [
  //           {
  //             id: '6c6dba95-e027-4fe2-acab-e8c155a7f0ff',
  //             title: 'Lord of The Rings',
  //           },
  //           {
  //             id: 'a2ae7712-75a7-47bb-82a9-8ed668e00fe3',
  //             title: 'The Matrix',
  //           },
  //           {
  //             id: '916fa462-3903-4656-9e76-3f182b37c56f',
  //             title: 'Star Wars: The Empire Strikes Back',
  //           },
  //         ],
  //       },
  //     })
  //   }),
];
