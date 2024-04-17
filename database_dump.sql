--
-- PostgreSQL database dump
--

-- Dumped from database version 13.5
-- Dumped by pg_dump version 13.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: dict_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.dict_type AS ENUM (
    'word',
    'idiom',
    'pun'
);


ALTER TYPE public.dict_type OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: dict; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dict (
    id integer NOT NULL,
    title character varying(256),
    translation character varying(256),
    source character varying(256),
    description character varying(2048),
    type character varying(8),
    link character varying(64),
    ipa character varying(64),
    source_id character varying(16)[]
);


ALTER TABLE public.dict OWNER TO postgres;

--
-- Name: dict_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dict_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dict_id_seq OWNER TO postgres;

--
-- Name: dict_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dict_id_seq OWNED BY public.dict.id;


--
-- Name: quiz; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quiz (
    id integer NOT NULL,
    _right character varying(50),
    _wrong character varying(50)
);


ALTER TABLE public.quiz OWNER TO postgres;

--
-- Name: quiz_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quiz_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.quiz_id_seq OWNER TO postgres;

--
-- Name: quiz_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quiz_id_seq OWNED BY public.quiz.id;


--
-- Name: dict id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dict ALTER COLUMN id SET DEFAULT nextval('public.dict_id_seq'::regclass);


--
-- Name: quiz id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz ALTER COLUMN id SET DEFAULT nextval('public.quiz_id_seq'::regclass);


--
-- Data for Name: dict; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dict (id, title, translation, source, description, type, link, ipa, source_id) FROM stdin;
2	Amazement	Изумление, удивление	\N	\N	word	amazement	əˈmeɪz.mənt	{Hamlet,Macbeth}
3	Not so, my lord; I am too much i' the sun.	Нет, мой лорд; я слишком часто пребываю под солнцем.	Hamlet, Act I, Scene 2	Ответ Гамлета на вопрос короля о том, почему тот столь печален: "How is it that the clouds still hang on you?". При этом король Клаудиус очень часто зовет Гамлета сыном. Каламбур основан на созвучии слов sun (солнце) и son (сын).	pun	not-so-my-lord	\N	{Hamlet}
1	All that lives must die	Всё, что живёт, обречено умереть	Hamlet, Act I, Scene 2	\N	idiom	all-that-lives-must-die	\N	{Hamlet}
4	Assassination	Убийство	\N	\N	word	assassination	əˌsæs.ɪˈneɪ.ʃən	{Macbeth}
6	Bloody	Кровавый, чёртов	\N	\N	word	bloody	ˈblʌd.i	{Hamlet,Romeo,Macbeth}
7	Bump	Удар, шишка, опухоль	\N	\N	word	bump	bʌmp	{Romeo}
8	Courtship	Ухаживание	\N	\N	word	courtship	ˈkɔːt.ʃɪp	{Romeo}
9	Dwindle	Уменьшаться, терять значение	\N	\N	word	dwindle	ˈdwɪn.dəl	{Macbeth}
10	Exposure	Экспозиция, разоблачение, вид	\N	\N	word	exposure	ɪkˈspəʊ.ʒər	{Macbeth}
11	Fitful	Прерывистый, судорожный	\N	\N	word	fitful	ˈfɪt.fəl	{Macbeth}
12	Generous	Щедрый, большой, крепкий	\N	\N	word	generous	ˈdʒen.ər.əs	{Hamlet}
13	Hurry	Спешить, спешка	\N	\N	word	hurry	ˈhʌr.i	{Romeo}
5	Auspicious	Благоприятный	\N	\N	word	auspicious	ɔːˈspɪʃ.əs	{Hamlet}
14	Inauspicious	Неблагоприятный, зловещий	\N	\N	word	inauscpicious	ˌɪn.ɔːˈspɪʃ.əs	{Romeo}
15	Invulnerable	Неуязвимый	\N	\N	word	invulnerable	ɪnˈvʌl.nər.ə.bəl	{Hamlet}
16	Lapse	Ошибка, промежуток времени, проходить	\N	\N	word	lapse	læps	{Hamlet}
17	Multitudinous	Многочисленный	\N	\N	word	multitudinous	ˌmʌl.tɪˈtjuː.dɪ.nəs	{Macbeth}
18	Palmy	Пальмовый, счастливый	\N	\N	word	palmy	ˈpɑːmi	{Hamlet}
19	Perusal	Прочтение, рассматривание	\N	\N	word	perusal	pəˈruː.zəl	{Hamlet}
20	Pious	Благочестивый	\N	\N	word	pious	ˈpaɪ.əs	{Hamlet,Macbeth}
21	A countenance more in sorrow than in anger	Лицо больше в печали, чем в гневе	Hamlet, Act I, Scene 2	\N	idiom	a-countenance-more-in-sorrow	\N	{Hamlet}
22	Brevity is the soul of wit	Краткость - душа остроумия	Hamlet, Act II, Scene 2	\N	idiom	brevity-is-the-soul-of	\N	{Hamlet}
23	Frailty, thy name is woman	Хрупкость, твоё имя - женщина	Hamlet, Act II, Scene 2	\N	idiom	frailty-thy-name-is-woman	\N	{Hamlet}
24	As white as snow	Белый, как снег	Hamlet, Act IV, Scene 5	\N	idiom	as-white-as-snow	\N	{Hamlet}
25	In my mind's eye	В моём мысленном взгляде	Hamlet, Act I, Scene 2	\N	idiom	in-my-minds-eye	\N	{Hamlet}
26	Neither a borrower nor a lender be	Не быть ни заёмщиком, ни кредитором	Hamlet, Act I, Scene 3	\N	idiom	neither-a-borrower-nor-a	\N	{Hamlet}
27	Primrose path	Путь наслаждений	Hamlet, Act I, Scene 3	\N	idiom	primrose-path	\N	{Hamlet}
28	Something is rotten in the state of Denmark	Что-то неладно в королевстве датском	Hamlet, Act I, Scene 4	\N	idiom	something-is-rotten-in-the	\N	{Hamlet}
29	The slings and arrows of outrageous fortune	Пращи и стрелы возмутительной судьбы	Hamlet, Act III, Scene 1	\N	idiom	the-slings-and-arrows-of	\N	{Hamlet}
30	To be, or not to be, that is the question	Быть или не быть, вот в чём вопрос	Hamlet, Act III, Scene 1	\N	idiom	to-be-or-not-to	\N	{Hamlet}
31	What a piece of work is a man	Что за чудо человек	Hamlet, Act II, Scene 2	\N	idiom	what-a-piece-of-work	\N	{Hamlet}
32	Woe is me	Горе мне	Hamlet, Act III, Scene 1	\N	idiom	woe-is-me	\N	{Hamlet}
33	At one fell swoop	Одним махом	Macbeth, Act IV, Scene 3	\N	idiom	at-one-fell-swoop	\N	{Macbeth}
34	A charmed life	Очарованная жизнь	Macbeth, Act V, Scene 8	\N	idiom	a-charmed-life	\N	{Macbeth}
35	A sorry sight	Жалкое зрелище	Macbeth, Act II, Scene 2	\N	idiom	a-sorry-sight	\N	{Macbeth}
36	Come what come may	Будь что будет	Macbeth, Act I, Scene 3	\N	idiom	сome-what-come-may	\N	{Macbeth}
37	Is this a dagger which I see before me	Не кинжал ли предо мной	Macbeth, Act II, Scene 1	\N	idiom	is-this-a-dagger-which	\N	{Macbeth}
38	Milk of human kindness	Добросердечие	Macbeth, Act I, Scene 5	\N	idiom	milk-of-human-kindness	\N	{Macbeth}
39	Which is which	Что есть что	Macbeth, Act III, Scene 4	\N	idiom	which-is-which	\N	{Macbeth}
40	Wild-goose chase	Погоня за недостижимым	Romeo and Juliet, Act II, Scene 4	\N	idiom	wild-goose-chase	\N	{Romeo}
41	You are a fishmonger.	Вы - торговец рыбой.	Hamlet, Act II, Scene 2	Так Гамлет саркастично обращается к Полонию. В разговорном языке "fishmonger" могло также значит сутенёр. Гамлет намекает на то, что Полоний готов обменять счастье дочери на почести от короля.	pun	you-are-a-fishmonger	\N	{Hamlet}
42	The rest is silence.	Остальное - тишина.	Hamlet, Act V, Scene 2	Гамлет смиряется со скорой смертью и рассматривает её как спокойствие. Кроме того, слово rest может означать как остаток, так и отдых.	pun	the-rest-is-silence	\N	{Hamlet}
43	It was a brute part of him to kill so capital a calf there.	Было грубо убить такого прекрасного телёнка.	Hamlet, Act III, Scene 2	Там Гамлет отреагировал на рассказ Полония о том, как тот играл в юношестве Цезаря и был убит в Капитолии Брутом. Каламбур основан на созвучии Capitol-capital, brute-Brutus.	pun	it-was-a-brute-part	\N	{Hamlet}
44	-That dreamers often lie. -In bed asleep, while they do dream things true.	-Что мечтатели часто лгут (лежат). -В постели, мечтая о вещах правдивых.	Romeo and Juliet, Act I, Scene 4	Каламбур основан на созвучии слов лежать и лгать (оба пишутся как lie).	pun	that-dreamers-often-lie	\N	{Romeo}
45	Give me a torch: I am not for this ambling; Being but heavy, I will bear the light.	Дай мне факел: я не буду танцевать; будучи печальным, принесу свет.	Romeo and Juliet, Act I, Scene 3	Слово heavy может переводиться как печальный, так и как тяжёлый. Light же обозначает, как лёгкий (не тяжелый), так и светлый, яркий.	pun	give-me-a-torch	\N	{Romeo}
\.


--
-- Data for Name: quiz; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quiz (id, _right, _wrong) FROM stdin;
18	Palmy	Flourishing
19	Perusal	Examination
20	Pious	Religious
21	Accommodation	Settlement
22	Critic	Commentator
23	Gloomy	Shadowy
24	Eventful	Busy
25	Countless	Innumerable
26	Radiance	Brightness
27	Seamy	Sordid
28	Sportive	Jolly
29	Suspicious	Unsure
30	Obscene	Vulgar
31	Baseless	Unfounded
32	Bloody	Blasted
33	Frugal	Cautious
34	Gnarled	Knotted
35	Monumental	Colossal
36	Misplaced	Lost
37	Majestic	Awesome
1	Impartial	Unbiased
2	Bandit	Outlaw
3	Dauntless	Spirited
4	Dwindle	Reduce
5	Amazement	Surprise
6	Assassination	Slaughter
7	Auspicious	Favourable
8	Bump	Hit
9	Courtship	Romance
10	Exposure	Exhibition
11	Fitful	Intermittent
12	Generous	Open-handed
13	Hurry	Hasten
14	Inauspicious	Unpromising
15	Invulnerable	Impervious
16	Lapse	Failure
17	Multitudinous	Numerous
38	Lonely	Alone
39	Laughable	Ridiculous
40	Road	Path
\.


--
-- Name: dict_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dict_id_seq', 45, true);


--
-- Name: quiz_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quiz_id_seq', 80, true);


--
-- Name: dict dict_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dict
    ADD CONSTRAINT dict_pkey PRIMARY KEY (id);


--
-- Name: quiz quiz_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz
    ADD CONSTRAINT quiz_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

