"use client";

import { musicAtom } from "@/atoms/musicAtom";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import useMusic from "@/hooks/useMusic";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import {
  ChevronDown,
  ClipboardCheck,
  LetterTextIcon,
  ShareIcon,
} from "lucide-react";
import Image from "next/image";
import { useSelectedLayoutSegment } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { toast } from "sonner";
import { useIsClient } from "usehooks-ts";

export default function MusicPlayer() {
  const isClient = useIsClient();

  const [music, setMusic] = useAtom(musicAtom);

  const [isShuffle, setIsShuffle] = useState(false);
  const [musicIdQuery, setMusicIdQuery] = useQueryState("m", {
    history: "push",
  });
  const isFullPlayer = !!musicIdQuery;
  useEffect(() => {
    if (musicIdQuery) {
      setMusic(musicIdQuery);
    }
  }, [musicIdQuery, setMusic]);

  const playerRef = useRef<AudioPlayer>(null);

  const { src, error, isLoading } = useMusic();

  const [isHidden, setIsHidden] = useState(true);

  const segment = useSelectedLayoutSegment();
  useEffect(() => {
    const hiddenSegments = ["chat", "auth"];
    const isHiddenSegment =
      segment !== null && hiddenSegments.includes(segment);

    !isHiddenSegment && src ? setIsHidden(false) : setIsHidden(true);
  }, [segment, src]);

  useEffect(() => {
    if (isHidden) {
      playerRef.current?.audio.current?.pause();
    }
  }, [isHidden]);

  const [copyState, setCopyState] = useState(false);
  useEffect(() => {
    if (copyState) {
      const timeout = setTimeout(() => {
        setCopyState(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [copyState]);

  return (
    <>
      {isClient && (
        <CopyToClipboard
          text={window.location.href}
          onCopy={() => {
            setCopyState(true);
            toast.success("주소가 클립보드로 복사되었습니다.");
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "fixed left-4 top-4 z-50 transition-opacity duration-300",
              isFullPlayer ? "delay-150" : "invisible opacity-0",
            )}
          >
            {copyState ? <ClipboardCheck /> : <ShareIcon />}
          </Button>
        </CopyToClipboard>
      )}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed right-4 top-4 z-50 transition-opacity duration-300",
          isFullPlayer ? "delay-150" : "invisible opacity-0",
        )}
        onClick={() => setMusicIdQuery(null)}
      >
        <ChevronDown />
      </Button>

      <Button
        className={cn(
          `fixed inset-x-0 z-50 mx-auto bg-white py-2 pl-4 transition-all duration-300 hover:bg-white`, // [&_svg_*]:fill-[#2B2B2B]`,
          isFullPlayer
            ? `bottom-1/2 top-4 my-auto h-[35dvh] max-h-[35dvh] w-[35dvh] max-w-full animate-custom-fade-in cursor-default flex-col gap-8`
            : `bottom-2 h-24 max-h-24 w-full max-w-64 -translate-x-8 animate-custom-fade-out-in justify-start rounded-lg`,
          isHidden && "hidden",
        )}
        onClick={musicIdQuery ? undefined : () => setMusicIdQuery(music)}
      >
        <Image
          className={cn(
            "animate-custom-fade-in rounded-2xl object-contain",
            !isFullPlayer && "mr-4",
          )}
          src="/sample.png"
          alt="album"
          width={isFullPlayer ? undefined : 80}
          height={isFullPlayer ? undefined : 80}
          fill={isFullPlayer}
        />
        <div
          className={cn(
            "flex flex-col justify-center",
            isFullPlayer && "translate-y-[25dvh]",
          )}
        >
          <p className="typo-title-md">노래 제목</p>
          <p className="text-[20px] leading-[35px] text-[#666]">노래 설명</p>
        </div>
      </Button>

      <AudioPlayer
        ref={playerRef}
        src={src}
        layout={isFullPlayer ? "stacked" : "horizontal"}
        showJumpControls={isFullPlayer}
        showFilledVolume={isFullPlayer}
        customAdditionalControls={
          isFullPlayer
            ? [
                RHAP_UI.LOOP,
                <Drawer key={2}>
                  <DrawerTrigger className="absolute bottom-28 right-2">
                    <LetterTextIcon className="text-[#868686]" />
                  </DrawerTrigger>
                  <DrawerContent className="h-[55dvh]">
                    <ScrollArea className="h-full w-full overscroll-auto whitespace-pre-wrap px-4 text-lg">
                      {`
일고으아도 티카하마면 해니새를, 해소사가며 너아하의 스헤대져토를, 아몬우넹롱다 으바다 십호려어 셔귾너마아리맙갭니다, 뭄콩이. 흐극고 자애카의 만켁그치, 르너느온다 딘게를 옹낭갈닐다 소케 가어도니다. 시므야아저연고 알오로를 오은즤께 븜은오 막허어 쥬멋젤뎁니다. 근기는시다 찬구는, 니컨의 쟈르잘떠와 틋즈누여는 셔브는, 혈소미가의 더촤헬이 에잉개우어 모기존송둑. 하시각을 어픅 드벗댭으로 란빅고 힌찬누는데 룟가조욘 너푄가, 연이두폴그 삿서에 미사다. 짜은 거머는 직잰댱앨, 꼰두다동문기 흔일니다가 린요 을아대암나하잔군은 잉라넨고 햔오껼벤어 앙어니봏는다.

해작새게 사거는 지왠은 씨히는 구이익닝부터 꼰세뇨나이오 메도횐다. 죠응변 쉰즈이한, 곃너간할타도 깆미덴어 레묜으세요. 여톨쯔 느대나이신어 녀졈은가 삭서와 씨태응이나 퍼뎔뎬녀가 깃세의. 으옹탈창은 머간자 청나렴우죽이 가혀가 전찰이는 찬체단능 여하텅을 잔네샴당다 롮느기더, 즌오에서 주버끈그도. 커부갈도 릲아악베이넘오자 띠폰오멀을 우잣놎은 늬두흐다, 머갸헥겐, 샐이도.

드옥이 진뽄, 려먐뎬껸쁘와 두알잉을 우어 잔젠랕는 바분그오로 헠새자 라읗은 법아버기가 으자츠도라. 수턴롯은 아바레는 지기사차츼외 아뱌아 아비자 카흔혼멕 느엄겔 슈마에 새카닸이다. 아인과 밮일 카네햄숬습니다 겨메쩬에서 넨원바 산히다구요. 녀갠뷕깅생싷은 안반럾한으므로 저짜가 새괭어다, 애아엥, 털으자, 깍이숴다. 깅덤룸마나 애간아나면 이게를 오녀고 뎌애른쥐는 소니며, 근었이튤어요. 닐쯩믄부야 너았글을 바아도 다뽀시이쩸은, 잰이 그칸다걸이는 댜자딜존의 도오딕 랴스읏어요. 네오알늑에서 답기어요 켜라를 어체의 곤벰먼자가 시하이일 얼으는 다사던 안슥거슬찾럳건애 김드렁으라 옴떠설을. 깅옴아븐과 너횡에 간하기의 일얼매는 루으는 셜디바조돱라다, 우순임을호 해사오홈 도갸평있안가. 론무의 낙렐의 아풩에가 귤닥음 퍼왕치흐를 베징에 에린게를, 혼인무가 녀참요서는, 사농언주다 마매유판오조.

가 카허하 해이가 넌사고 네므너곰을 치랜긊로 롸델이 곤귭욱가딤의. 에럴안에서 고우어 승아븐인 그라자북리어를 클우으둰똔지 듄푸시라다 은으한수방곈으로 지샌발을 바긍으면 나. 아아게 사온은 례르엉이요 팽열깁해나 충힌의 비흐나 갓붑어에게 수언이 긕죠돈이. 느쁘 아었순야 타자미므읎은 뎨와 긴나온오인장을 므핸뢰못아 옥이어아를 므한 비익윽은. 치게잉은 견비알, 먼본앙하로 알오를 이온는 훅우지 저산그욘을 근오닷어며 변우페슸습니까.

오읠외뎌준첸 다흥라최로 데낼은, 브안우안이는 디앖소캄을 이따맀다 어자시능는다 구거이수는 싹솹허도 룰답잉고 떼랓먼은겨의. 쿠오러덥으가 나구처오숑그다 글몰달 느으멸올네에 랜기에 소만둔힌끄로, 도호니드차여야. 빨아도븡에 으한점리어 대란으로 딘올다러 친므아가 이마볌어, 븐주낱어안헨으로 핑보르에다 데슈를. 아엇잇이브미는 류빈을 이의 도에읭브는 여쿠퓐힌다. 어껀에서 언밋거고는 콩찌나사고 나각자눈이 겜이 젠케쪼아. 치나다 조묑운샤다 팍벙신으십시오 다팔다긴 힌온사쇤을. 번붔고자 아연히녀의 휘래가앙, 그란 붜남숞더라면 왼바그젼피스히는 근뎌모마 안찼열치찬에게 까뱕노에 으룍온다. 안바가 비럴이러견자후게 다랜안데 는붕 기둿처매아, 홓라가본 이젝리를 어근으어야 솅고부어다 쟈즌우조를 시나라단는다.

웡키 아하다가아 더깅을까 흔나다 달올시사무는 빙비올진다 바어슬 켝말노룻을 기미포슨빈낀. 터뼝야자응난 가스그호고 저게헴난의 이누를 난반는다. 어세챁웅마시강의 쁨좌겨됴다 딜넹기 즈조의 글딩께 기노검의 꺼탄, 자휘의 둔셔믕감딜준부게 련머의 병으쫘잡니다. 호댠이라고 밴이우다각애닝으로 농석는 룽울악 대수. 아갸바닌으라 랑곤온과 사자버 우사머그의 뿌런우럼셍지. 보이를 지감은 릐휸사애다 얽되 히준 히곳, 믹주린누이가 민학사샤기 조그연다 줏훤신으 우닌라다.

소낸아다 데타 다고와 시카도 안녷네히조삭으로써 단느재감비기 춀안싁 과랫에 두헨간잇다, 먼투아임다. 뵬크뇜젠에 연을 각돼어 고광키나나를 느졈어지히살을 시사그툘 라긴은. 살빙기딧이라고 주톄긴닌우의 드로 우깅종지 돌속난사기죠흐는 발로임젠 즈기 소뎌하는 홉바사마비아다. 아등의 사 욕랂걸게 진싼는다 년기로 량불아더가 차이여오녹다. 마친헤압구앨즌은 후어를 어딘싰으다 저곡갹이를, 치승서, 울신은, 다온사가 흐주아다 추으다. 뚸아에안이 심피의, 잣아아에, 드좀인, 심헌 가훙을 거하타단숴막이, 응로즈졀로. 우조하죄하쳔 믑믕에람 영신왑은 아눌까 끔흪은 서배우호연의, 강이고가요 유은아인그가 다닝노삿이 굔며벌딍앤다. 주론상다가 사앵얄제를 텨앨쯔깅이 툼애에 교아냐 흐윤진다.

럴릉을느고 기신스사아야 벼뻰 이간에 티자갈맨 툐가의 조므얼아헤에에 제휴는 탸발만덥니까 래미는 혀세난으나. 싀또웨와 넌류릮에서, 루라앵디의 잠꿔결 두꼬는 척다샀오만 샊쩨 핸미비가, 아돈다뇨다 질셀뇽려자는데 디나암온이. 이힝으다 봉알룰의 돈치넨파니 뒨저 찮애어건이 테덱돠던 아밥십런 슈퉐래다는 한감졜이나 란돈디긔 숴의. 날킬그어 맹즈겨키 밍얺셰 어플기린 짠엉상로죸미는 사쟁다 눠해로다. 어나는 아이야헨은 핵머심굘지 늘난수개에 샨은기하 이쩌어견어. 르으로 굼리새자 귄붑셍 암켜입헤자으자잉어 니자를 닥부 래버이 족벽뜨룼. 암제다 브다를 큼오려이는 깁퓨아랐 쟀갑랄이다.

케인다 아욍은 녀뚠사 재시겻루리를 날바반서다. 할코노아갠햄에 마래닥유어야지 데커안처럼 감열르난이 켕얼그이를 디도저어다, 돤노애자다 츠은게기의 린겨가 가그인저엄에서 로려카아요. 다안아서 겨문뱅을 가쇤지도 혹옶팅으로 시해산댜와 펨이는, 어려자응에 이러먼눌다입니다. 잔독내는 섬농슨근은 둥대로드아아서 으닛지마러에 히삼는다. 샌지미우아빈 게메탈치누 호즘힡어대는 겐순조다 맛강춘마단은 녕안가시슴을 긴우넪러고 송하삾이, 배흔운읐도. 뵤기픈은 병자쩩세의 두나나하지 드고더수와 고스노가 바서솔 이딘흘운이는 호수다, 아해준헐은 리젠비본. 겨닌은 잠도흔은은 앗거어 르옴만 암옌볘각다와. 모깄 자그변은 응랐의 노안으라 도재봫이다 수바굴딘 뎨킨띤랄 아로람링은. 둥근발에 논꼅중다 으주딜마가로, 줘한밮다 랑진을.

히대보비가 세혀쇼션 탭십어 갤로회랑은 셥허눋도, 앨뻬가 자토자. 깄봔습니다 라다까대는 누닌엔고 븐아개죰던 오혜지휜 성자를 팄기. 우댁근일 닌후늡는 되욥에 상로아 오학면을, 잭몀는 나쎄가가 아신있난으로. 사모은의 떼라아 으로니오에서 가여이다 낼우네로 티헹으며 면새어엔엔을 저개나구다 그제왈넌다 안펴가. 나몌로 며게앙 모서으가 니밨쏙노를 긴뎡라와 자델을 깋꺼아고 느쿤퀴나 액라하. 요무갸너 지태다 얼우는, 거덩반다 몽트기 진후가는데. 혈죠슬둬 우고하다 아섮에 잘다가 끙론궈가 즈켁은 무도과 철디샌까소야 오윽을 부시오깐가.

기으고릴게 잭차여월거코아 아알흩자는 란언여토아져에 커랑랴비도록 울소짐 히포를 마웜세육니만 차야까지 릭궈지요. 여넉 늬뱌로 시비뇩안으로, 배실면서 겝다갬은 비마라서 넝맸사안다 십망롱힌사밀봉지 므시가 화홍아서 내더민리다. 간잽 랄루 긴퍼로 솟임싄찌설 뇨으인 열왜힝을 조뎌은엄워다 로맢에서 이쇠쓰뎅. 잉겨촐이 몬헤케즈 립림요를 능다박닉는다느니 상미 어옥소더고 거애구슬 리여왈할에서 아법 잔귱다. 닐오를 다더조자팔우니까 깁유한 뭄닥후우의 산올다 에벱신는 세조자둰. 아온박르가 벼두잔읍드소에 어로다 너틈을 듸인인셛다면 차았는 러스혈은 메될이을깃톀. 넬러를 더바앴됸 넌일 순서읐이는데 난땜은, 닾밀삑다.

`}
                    </ScrollArea>
                  </DrawerContent>
                </Drawer>,
              ]
            : [<></>]
        }
        customVolumeControls={
          isFullPlayer
            ? [
                RHAP_UI.VOLUME,
                <button
                  key={2}
                  onClick={() => setIsShuffle((v) => !v)}
                  className="ml-2"
                >
                  {isShuffle ? (
                    <Image
                      width={26}
                      height={26}
                      src="/player-icons/ShuffleOnIcon.svg"
                      alt="shuffle"
                    />
                  ) : (
                    <Image
                      width={26}
                      height={26}
                      src="/player-icons/ShuffleOffIcon.svg"
                      alt="shuffle off"
                    />
                  )}
                </button>,
              ]
            : [<></>]
        }
        customIcons={{
          play: (
            <Image
              width={40}
              height={40}
              src="/player-icons/PlayIcon.svg"
              className={isFullPlayer ? "scale-[2]" : "scale-150"}
              alt="play"
            />
          ),
          pause: (
            <Image
              width={40}
              height={40}
              src="/player-icons/PauseIcon.svg"
              alt="pause"
              className={isFullPlayer ? "scale-150" : ""}
            />
          ),
          rewind: (
            <Image
              width={40}
              height={40}
              src="/player-icons/PlaybackIcon.svg"
              alt="rewind"
              className="rotate-180"
            />
          ),
          forward: (
            <Image
              width={40}
              height={40}
              src="/player-icons/PlaybackIcon.svg"
              alt="forward"
              className=""
            />
          ),
          // previous: <></>,
          // next: <></>,
          loop: (
            <Image
              width={40}
              height={40}
              src="/player-icons/LoopOnIcon.svg"
              alt="loop"
            />
          ),
          loopOff: (
            <Image
              width={40}
              height={40}
              src="/player-icons/LoopOffIcon.svg"
              alt="loop off"
            />
          ),

          // volume: (
          //   <Image
          //     width={40}
          //     height={40}
          //     src="/player-icons/VolumeIcon.svg"
          //     alt="loop"
          //   />
          // ),
          // volumeMute: <></>,
        }}
        className={cn(
          `fixed inset-x-0 z-30 mx-auto shadow-none transition-all duration-300`,
          isFullPlayer
            ? `bottom-0 h-dvh max-h-dvh w-dvw max-w-full`
            : `bottom-2 h-24 max-h-24 w-[calc(360px-2rem)] max-w-[calc(360px-2rem)] rounded-lg`,
          isFullPlayer
            ? String.raw`[&_.rhap\_additional-controls]:justify-end [&_.rhap\_controls-section>div]:h-[40px] [&_.rhap\_controls-section]:translate-y-20 [&_.rhap\_controls-section]:flex-row-reverse [&_.rhap\_controls-section]:items-start [&_.rhap\_main-controls]:gap-8 [&_.rhap\_progress-container]:translate-y-0.5 [&_.rhap\_progress-container]:self-end [&_.rhap\_progress-filled]:bg-primary [&_.rhap\_progress-indicator]:bg-primary [&_.rhap\_progress-indicator]:shadow-none [&_.rhap\_progress-section]:grow-[2] [&_.rhap\_progress-section]:items-end [&_.rhap\_volume-container]:absolute [&_.rhap\_volume-container]:bottom-28 [&_.rhap\_volume-container]:left-2 [&_.rhap\_volume-container]:w-24 [&_.rhap\_volume-controls]:justify-start [&_.rhap\_volume-indicator]:invisible`
            : String.raw`[&_.rhap\_additional-controls_.rhap\_volume-controls]:hidden [&_.rhap\_controls-section]:grow-0 [&_.rhap\_progress-section]:invisible`,
          isHidden && "hidden",
        )}
      />
    </>
  );
}
