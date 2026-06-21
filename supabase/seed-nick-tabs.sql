-- ============================================================
-- Seed rows for Nick's two new tabs: Ads Report + Group-Buy.
-- Paste into the team's Supabase SQL Editor and Run once.
-- Safe to re-run: each block deletes its own category first, so no duplicates.
-- ============================================================

-- ---- Ads Report (category 'ad') — real May data from Nick's daily tracker.
-- One row = one day. Per-platform spend/sales live in meta; the tab sums them.
-- (First 10 days transcribed from the screenshot; load the full month via CSV later.)
delete from records where category = 'ad';
insert into records (title, status, amount, category, due_date, notes, meta) values
('Ads 2026-05-01','active',364.34,'ad','2026-05-01','Daily ad report','{"shopee_cpas":28.82,"lazada_cpas":34.95,"awa":0,"lead_to_pm":300.57,"new_pm":20,"pmed":3,"comments":0,"new_order":0,"repeat_order":0,"products_sold":0,"fb_new":0,"fb_repeat":0,"insta_new":0,"insta_repeat":0,"shopee_sales":0,"lazada_sales":0,"other_sales":0}'::jsonb),
('Ads 2026-05-02','active',244.74,'ad','2026-05-02','Daily ad report','{"shopee_cpas":17.91,"lazada_cpas":26.58,"awa":0,"lead_to_pm":200.25,"new_pm":8,"pmed":2,"comments":0,"new_order":0,"repeat_order":0,"products_sold":0,"fb_new":0,"fb_repeat":0,"insta_new":0,"insta_repeat":0,"shopee_sales":888,"lazada_sales":0,"other_sales":0}'::jsonb),
('Ads 2026-05-03','active',263.92,'ad','2026-05-03','Daily ad report','{"shopee_cpas":25.28,"lazada_cpas":20.80,"awa":0,"lead_to_pm":217.84,"new_pm":11,"pmed":1,"comments":0,"new_order":1,"repeat_order":1,"products_sold":12,"fb_new":914,"fb_repeat":914,"insta_new":0,"insta_repeat":0,"shopee_sales":618,"lazada_sales":0,"other_sales":0}'::jsonb),
('Ads 2026-05-04','active',268.95,'ad','2026-05-04','Daily ad report','{"shopee_cpas":25.88,"lazada_cpas":26.35,"awa":0,"lead_to_pm":216.72,"new_pm":7,"pmed":0,"comments":1,"new_order":0,"repeat_order":0,"products_sold":0,"fb_new":0,"fb_repeat":0,"insta_new":0,"insta_repeat":0,"shopee_sales":416,"lazada_sales":1740,"other_sales":0}'::jsonb),
('Ads 2026-05-05','active',142.19,'ad','2026-05-05','Daily ad report','{"shopee_cpas":22.28,"lazada_cpas":0,"awa":26.15,"lead_to_pm":93.76,"new_pm":5,"pmed":0,"comments":0,"new_order":0,"repeat_order":1,"products_sold":0,"fb_new":0,"fb_repeat":0,"insta_new":0,"insta_repeat":0,"shopee_sales":237,"lazada_sales":0,"other_sales":0}'::jsonb),
('Ads 2026-05-06','active',122.05,'ad','2026-05-06','Daily ad report','{"shopee_cpas":16.62,"lazada_cpas":0,"awa":33.78,"lead_to_pm":71.65,"new_pm":4,"pmed":0,"comments":1,"new_order":0,"repeat_order":0,"products_sold":0,"fb_new":0,"fb_repeat":0,"insta_new":0,"insta_repeat":0,"shopee_sales":247.50,"lazada_sales":0,"other_sales":0}'::jsonb),
('Ads 2026-05-07','active',212.74,'ad','2026-05-07','Daily ad report','{"shopee_cpas":25.07,"lazada_cpas":34.72,"awa":21.95,"lead_to_pm":131.00,"new_pm":6,"pmed":1,"comments":0,"new_order":2,"repeat_order":0,"products_sold":9,"fb_new":1371,"fb_repeat":0,"insta_new":0,"insta_repeat":0,"shopee_sales":0,"lazada_sales":0,"other_sales":0}'::jsonb),
('Ads 2026-05-08','active',168.26,'ad','2026-05-08','Daily ad report','{"shopee_cpas":13.54,"lazada_cpas":28.71,"awa":0,"lead_to_pm":126.01,"new_pm":4,"pmed":2,"comments":1,"new_order":3,"repeat_order":0,"products_sold":8,"fb_new":755,"fb_repeat":0,"insta_new":457,"insta_repeat":0,"shopee_sales":0,"lazada_sales":0,"other_sales":0}'::jsonb),
('Ads 2026-05-09','active',116.42,'ad','2026-05-09','Daily ad report','{"shopee_cpas":16.48,"lazada_cpas":10.99,"awa":0,"lead_to_pm":88.95,"new_pm":3,"pmed":1,"comments":0,"new_order":0,"repeat_order":1,"products_sold":0,"fb_new":0,"fb_repeat":914,"insta_new":0,"insta_repeat":0,"shopee_sales":0,"lazada_sales":0,"other_sales":0}'::jsonb),
('Ads 2026-05-10','active',200.73,'ad','2026-05-10','Daily ad report','{"shopee_cpas":17.80,"lazada_cpas":13.73,"awa":0,"lead_to_pm":169.20,"new_pm":10,"pmed":1,"comments":1,"new_order":0,"repeat_order":1,"products_sold":6,"fb_new":914,"fb_repeat":0,"insta_new":0,"insta_repeat":0,"shopee_sales":0,"lazada_sales":0,"other_sales":0}'::jsonb);

-- ---- Group-Buy events (category 'groupbuy') — example rows; replace with real ones.
-- amount = revenue collected so far; meta carries unit price + order count + host.
delete from records where category = 'groupbuy';
insert into records (title, status, amount, category, due_date, notes, meta) values
('LactoDay Probiotic Bundle','active',7800,'groupbuy','2026-06-23','WhatsApp group buy','{"host":"Nick","price":120,"orders":65,"product":"LactoDay Probiotic x2"}'::jsonb),
('Enerboost Slimming Combo','active',4452,'groupbuy','2026-06-22','IG broadcast','{"host":"Mei","price":159,"orders":28,"product":"Enerboost 30-day combo"}'::jsonb),
('BetterDay Detox Set','active',4158,'groupbuy','2026-06-28','FB group','{"host":"Nick","price":99,"orders":42,"product":"BetterDay Detox 14-day"}'::jsonb),
('Heragen PDRN Launch GB','done',10547,'groupbuy','2026-06-15','Closed - fulfilled','{"host":"Sean","price":199,"orders":53,"product":"Heragen PDRN serum"}'::jsonb);
