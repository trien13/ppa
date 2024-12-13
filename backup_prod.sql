--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

-- Started on 2024-12-13 07:40:13

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
-- TOC entry 842 (class 1247 OID 32817)
-- Name: replies; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.replies AS (
	reply_username text,
	reply_content text,
	reply_parent integer
);


ALTER TYPE public.replies OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 81981)
-- Name: book; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book (
    topics text NOT NULL
);


ALTER TABLE public.book OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 32830)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    username text NOT NULL,
    pass text NOT NULL,
    email character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4785 (class 0 OID 81981)
-- Dependencies: 217
-- Data for Name: book; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.book (topics) FROM stdin;
\.


--
-- TOC entry 4784 (class 0 OID 32830)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (username, pass, email) FROM stdin;
\.


-- Completed on 2024-12-13 07:40:13

--
-- PostgreSQL database dump complete
--

