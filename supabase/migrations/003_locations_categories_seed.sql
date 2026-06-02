-- =============================================
-- Seed: Alle provincies, steden en categorieën
-- Uitvoeren in: Supabase Dashboard > SQL Editor
-- =============================================

-- Membership tier kolom (als nog niet aangemaakt)
alter table photographers
  add column if not exists membership_tier text not null default 'free',
  add column if not exists portfolio_by_category jsonb default '{}';

-- Wis bestaande seed data
truncate regions restart identity cascade;
truncate photography_types restart identity cascade;

-- ── REGIO'S ────────────────────────────────────────────────────────

insert into regions (name, slug, province, city) values
  -- Provincies
  ('Noord-Holland', 'noord-holland', 'Noord-Holland', null),
  ('Zuid-Holland', 'zuid-holland', 'Zuid-Holland', null),
  ('Noord-Brabant', 'noord-brabant', 'Noord-Brabant', null),
  ('Utrecht', 'utrecht-provincie', 'Utrecht', null),
  ('Gelderland', 'gelderland', 'Gelderland', null),
  ('Overijssel', 'overijssel', 'Overijssel', null),
  ('Limburg', 'limburg', 'Limburg', null),
  ('Groningen', 'groningen-provincie', 'Groningen', null),
  ('Friesland', 'friesland', 'Friesland', null),
  ('Flevoland', 'flevoland', 'Flevoland', null),
  ('Zeeland', 'zeeland', 'Zeeland', null),
  ('Drenthe', 'drenthe', 'Drenthe', null),

  -- Noord-Holland steden
  ('Amsterdam', 'amsterdam', 'Noord-Holland', 'Amsterdam'),
  ('Haarlem', 'haarlem', 'Noord-Holland', 'Haarlem'),
  ('Zaandam', 'zaandam', 'Noord-Holland', 'Zaandam'),
  ('Hoofddorp', 'hoofddorp', 'Noord-Holland', 'Hoofddorp'),
  ('Alkmaar', 'alkmaar', 'Noord-Holland', 'Alkmaar'),
  ('Hilversum', 'hilversum', 'Noord-Holland', 'Hilversum'),
  ('Amstelveen', 'amstelveen', 'Noord-Holland', 'Amstelveen'),
  ('Purmerend', 'purmerend', 'Noord-Holland', 'Purmerend'),
  ('Heerhugowaard', 'heerhugowaard', 'Noord-Holland', 'Heerhugowaard'),
  ('Huizen', 'huizen', 'Noord-Holland', 'Huizen'),
  ('IJmuiden', 'ijmuiden', 'Noord-Holland', 'IJmuiden'),
  ('Nieuw-Vennep', 'nieuw-vennep', 'Noord-Holland', 'Nieuw-Vennep'),
  ('Heemskerk', 'heemskerk', 'Noord-Holland', 'Heemskerk'),

  -- Zuid-Holland steden
  ('Rotterdam', 'rotterdam', 'Zuid-Holland', 'Rotterdam'),
  ('Den Haag', 'den-haag', 'Zuid-Holland', 'Den Haag'),
  ('Leiden', 'leiden', 'Zuid-Holland', 'Leiden'),
  ('Dordrecht', 'dordrecht', 'Zuid-Holland', 'Dordrecht'),
  ('Zoetermeer', 'zoetermeer', 'Zuid-Holland', 'Zoetermeer'),
  ('Delft', 'delft', 'Zuid-Holland', 'Delft'),
  ('Alphen aan den Rijn', 'alphen-aan-den-rijn', 'Zuid-Holland', 'Alphen aan den Rijn'),
  ('Spijkenisse', 'spijkenisse', 'Zuid-Holland', 'Spijkenisse'),
  ('Gouda', 'gouda', 'Zuid-Holland', 'Gouda'),
  ('Vlaardingen', 'vlaardingen', 'Zuid-Holland', 'Vlaardingen'),
  ('Schiedam', 'schiedam', 'Zuid-Holland', 'Schiedam'),
  ('Katwijk', 'katwijk', 'Zuid-Holland', 'Katwijk'),
  ('Capelle aan den IJssel', 'capelle-aan-den-ijssel', 'Zuid-Holland', 'Capelle aan den IJssel'),
  ('Ridderkerk', 'ridderkerk', 'Zuid-Holland', 'Ridderkerk'),
  ('Rijswijk', 'rijswijk', 'Zuid-Holland', 'Rijswijk'),
  ('Maassluis', 'maassluis', 'Zuid-Holland', 'Maassluis'),
  ('Hellevoetsluis', 'hellevoetsluis', 'Zuid-Holland', 'Hellevoetsluis'),

  -- Noord-Brabant steden
  ('Eindhoven', 'eindhoven', 'Noord-Brabant', 'Eindhoven'),
  ('Tilburg', 'tilburg', 'Noord-Brabant', 'Tilburg'),
  ('Breda', 'breda', 'Noord-Brabant', 'Breda'),
  ('''s-Hertogenbosch', 's-hertogenbosch', 'Noord-Brabant', '''s-Hertogenbosch'),
  ('Helmond', 'helmond', 'Noord-Brabant', 'Helmond'),
  ('Oss', 'oss', 'Noord-Brabant', 'Oss'),
  ('Roosendaal', 'roosendaal', 'Noord-Brabant', 'Roosendaal'),
  ('Bergen op Zoom', 'bergen-op-zoom', 'Noord-Brabant', 'Bergen op Zoom'),
  ('Waalwijk', 'waalwijk', 'Noord-Brabant', 'Waalwijk'),
  ('Oosterhout', 'oosterhout', 'Noord-Brabant', 'Oosterhout'),
  ('Uden', 'uden', 'Noord-Brabant', 'Uden'),

  -- Utrecht steden
  ('Utrecht', 'utrecht', 'Utrecht', 'Utrecht'),
  ('Amersfoort', 'amersfoort', 'Utrecht', 'Amersfoort'),
  ('Veenendaal', 'veenendaal', 'Utrecht', 'Veenendaal'),
  ('Nieuwegein', 'nieuwegein', 'Utrecht', 'Nieuwegein'),
  ('Zeist', 'zeist', 'Utrecht', 'Zeist'),
  ('Houten', 'houten', 'Utrecht', 'Houten'),
  ('Woerden', 'woerden', 'Utrecht', 'Woerden'),
  ('IJsselstein', 'ijsselstein', 'Utrecht', 'IJsselstein'),

  -- Gelderland steden
  ('Nijmegen', 'nijmegen', 'Gelderland', 'Nijmegen'),
  ('Arnhem', 'arnhem', 'Gelderland', 'Arnhem'),
  ('Apeldoorn', 'apeldoorn', 'Gelderland', 'Apeldoorn'),
  ('Ede', 'ede', 'Gelderland', 'Ede'),
  ('Doetinchem', 'doetinchem', 'Gelderland', 'Doetinchem'),
  ('Tiel', 'tiel', 'Gelderland', 'Tiel'),
  ('Harderwijk', 'harderwijk', 'Gelderland', 'Harderwijk'),
  ('Zutphen', 'zutphen', 'Gelderland', 'Zutphen'),
  ('Wageningen', 'wageningen', 'Gelderland', 'Wageningen'),

  -- Overijssel steden
  ('Enschede', 'enschede', 'Overijssel', 'Enschede'),
  ('Zwolle', 'zwolle', 'Overijssel', 'Zwolle'),
  ('Deventer', 'deventer', 'Overijssel', 'Deventer'),
  ('Hengelo', 'hengelo', 'Overijssel', 'Hengelo'),
  ('Almelo', 'almelo', 'Overijssel', 'Almelo'),
  ('Kampen', 'kampen', 'Overijssel', 'Kampen'),

  -- Limburg steden
  ('Maastricht', 'maastricht', 'Limburg', 'Maastricht'),
  ('Venlo', 'venlo', 'Limburg', 'Venlo'),
  ('Sittard', 'sittard', 'Limburg', 'Sittard'),
  ('Heerlen', 'heerlen', 'Limburg', 'Heerlen'),
  ('Roermond', 'roermond', 'Limburg', 'Roermond'),
  ('Kerkrade', 'kerkrade', 'Limburg', 'Kerkrade'),
  ('Weert', 'weert', 'Limburg', 'Weert'),

  -- Groningen steden
  ('Groningen', 'groningen', 'Groningen', 'Groningen'),
  ('Hoogezand', 'hoogezand', 'Groningen', 'Hoogezand'),

  -- Friesland steden
  ('Leeuwarden', 'leeuwarden', 'Friesland', 'Leeuwarden'),
  ('Drachten', 'drachten', 'Friesland', 'Drachten'),
  ('Heerenveen', 'heerenveen', 'Friesland', 'Heerenveen'),

  -- Flevoland steden
  ('Almere', 'almere', 'Flevoland', 'Almere'),
  ('Lelystad', 'lelystad', 'Flevoland', 'Lelystad'),
  ('Dronten', 'dronten', 'Flevoland', 'Dronten'),

  -- Zeeland steden
  ('Middelburg', 'middelburg', 'Zeeland', 'Middelburg'),
  ('Vlissingen', 'vlissingen', 'Zeeland', 'Vlissingen'),
  ('Goes', 'goes', 'Zeeland', 'Goes'),

  -- Drenthe steden
  ('Assen', 'assen', 'Drenthe', 'Assen'),
  ('Emmen', 'emmen', 'Drenthe', 'Emmen'),
  ('Hoogeveen', 'hoogeveen', 'Drenthe', 'Hoogeveen')

on conflict (slug) do update set
  name = excluded.name,
  province = excluded.province,
  city = excluded.city;

-- ── FOTOGRAFIE TYPES ───────────────────────────────────────────────

insert into photography_types (name, slug, description) values
  ('Drone / Lucht', 'drone-lucht', 'Professionele luchtfotografie met drones'),
  ('Food & restaurant', 'food-restaurant', 'Food- en restaurantfotografie'),
  ('Afscheid', 'afscheid', 'Rouwfotografie en afscheidsfotografie'),
  ('Baby', 'baby', 'Babyfotografie voor pasgeborenen en peuters'),
  ('Evenementen', 'evenementen', 'Evenement- en feestfotografie'),
  ('Makelaars', 'makelaars', 'Vastgoed- en interieursfotografie voor makelaars'),
  ('Bedrijf', 'bedrijf', 'Zakelijke fotografie en bedrijfsreportages'),
  ('Huisdier', 'huisdier', 'Professionele huisdierfotografie'),
  ('Familie', 'familie', 'Familie- en gezinsfotografie'),
  ('Portret', 'portret', 'Professionele portretfotografie'),
  ('Boudoir', 'boudoir', 'Intieme boudoirfotografie'),
  ('Bruiloft', 'bruiloft', 'Bruilofts- en trouwfotografie'),
  ('Zwangerschap', 'zwangerschap', 'Zwangerschapsfotografie'),
  ('Feest', 'feest', 'Feest- en verjaardagsfotografie')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description;
