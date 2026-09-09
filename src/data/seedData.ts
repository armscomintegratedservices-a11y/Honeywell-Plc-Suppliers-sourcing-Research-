import { RawSupplierRecord } from "../types";

export const RAW_SEED_CSV = `ID,Product,Category,Market,Origin,Supplier,Supplier ID,Unit,Price/kg,Quality %,Lead days,Reliability %,Capacity t/mo,MOQ kg,Spec,Certification,Cert OK,Delivery OK,Status,Demand Index,Customer Quality %,Complaints %,Supplier Score,Qualification
1,Maize Grain,Maize,Plateau,Kano,Prime Foods Plateau Ltd,SUP-071,kg,567.14,72.7,10,75.6,20,250,Fully Match,SON; HACCP,Yes,Yes,Inactive,39,70.0,1.3,59.3,Review
1,Maize Grain,Maize,Ondo,Kano,Naija Commodities Ondo Ltd,SUP-054,kg,478.13,87.7,8,90.2,100,500,Partial Match,SON; HACCP,Yes,Yes,Active,35,94.0,7.3,71.3,Review
1,Maize Grain,Maize,Kebbi,Kano,FreshSource Kebbi Ltd,SUP-026,kg,579.99,80.8,6,74.7,75,250,Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,80,97.0,3.4,63.0,Review
2,Soya Beans,Oilseeds,Rivers,Kano,Naija Commodities Rivers Ltd,SUP-056,kg,871.51,73.1,16,84.6,100,250,Fully Match,ISO 9001; HACCP,No,No,Active,59,92.0,1.1,51.2,Review
2,Soya Beans,Oilseeds,Kwara,Kano,FreshSource Kwara Ltd,SUP-027,kg,"1,027.48",92.1,4,94.5,10,"2,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,55,81.0,3.5,72.3,Qualified
2,Soya Beans,Oilseeds,Kano,Kano,AgroLink Kano Ltd,SUP-003,kg,"1,030.98",90.2,4,86.9,20,"5,000",Fully Match,NAFDAC; HACCP,Yes,Yes,Inactive,83,78.0,8.9,69.8,Review
2,Soya Beans,Oilseeds,Lagos,Kano,Golden Fields Lagos Ltd,SUP-036,kg,"1,019.12",86.5,12,94.1,5,500,Fully Match,ISO 9001; HACCP,No,No,Active,86,78.0,1.1,56.2,Review
3,Sorghum,Cereals,Cross River,Kaduna,FreshSource Cross River Ltd,SUP-025,kg,"1,022.99",86.7,12,74.6,150,"2,000",Partial Match,NAFDAC; HACCP,Yes,No,Active,52,77.0,6.8,59.1,Review
3,Sorghum,Cereals,Kaduna,Kaduna,AgroLink Kaduna Ltd,SUP-002,kg,889.41,91.4,15,95.8,100,"1,000",Fully Match,NAFDAC; HACCP,Yes,No,Inactive,46,94.0,0.9,66.9,Review
4,Millet,Cereals,Lagos,Kano,AgroLink Lagos Ltd,SUP-005,kg,823.62,88.3,15,86.5,100,"2,000",Partial Match,SON; HACCP,Yes,No,Active,36,91.0,6.6,67.4,Review
4,Millet,Cereals,Oyo,Kano,Golden Fields Oyo Ltd,SUP-038,kg,"1,052.11",86.0,10,91.8,75,250,Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,93,70.0,8.6,66.3,Qualified
4,Millet,Cereals,Kogi,Kano,FarmGate Kogi Ltd,SUP-012,kg,"1,129.65",78.8,18,91.6,10,"1,000",Fully Match,NAFDAC; HACCP,Yes,No,Active,55,87.0,8.6,58.0,Review
5,Cassava Flour,Flours,Plateau,Ogun,Golden Fields Plateau Ltd,SUP-039,kg,"1,339.03",95.9,12,83.1,10,"1,000",Fully Match,NAFDAC; HACCP,Yes,No,Active,65,98.0,5.3,63.4,Review
5,Cassava Flour,Flours,Ondo,Ogun,FarmGate Ondo Ltd,SUP-014,kg,946.06,91.0,4,98.3,20,500,Partial Match,SON; HACCP,Yes,Yes,Active,68,86.0,7.9,77.9,Review
5,Cassava Flour,Flours,Kebbi,Ogun,FoodPro Kebbi Ltd,SUP-018,kg,"1,106.47",77.5,8,90.1,100,"1,000",Partial Match,SON; HACCP,Yes,Yes,Inactive,50,77.0,2.4,67.1,Review
5,Cassava Flour,Flours,Cross River,Ogun,Unity Agro Cross River Ltd,SUP-073,kg,"1,066.85",87.3,9,86.2,5,250,Fully Match,NAFDAC; HACCP,Yes,Yes,Active,39,97.0,3.3,68.7,Qualified
6,Garri,Flours,Rivers,Ogun,FarmGate Rivers Ltd,SUP-016,kg,917.85,79.2,17,74.6,20,"5,000",Partial Match,NAFDAC; HACCP,Yes,No,Inactive,87,76.0,1.3,57.5,Review
6,Garri,Flours,Kwara,Ogun,FoodPro Kwara Ltd,SUP-019,kg,971.74,81.2,15,82.5,5,250,Fully Match,NAFDAC; HACCP; ISO 22000,Yes,No,Active,48,77.0,2.1,60.0,Review
7,Wheat Flour,Flours,Cross River,Lagos,FoodPro Cross River Ltd,SUP-017,kg,858.14,75.6,7,76.6,30,250,Partial Match,ISO 9001; HACCP,No,Yes,Active,41,90.0,9.0,52.9,Review
7,Wheat Flour,Flours,Kaduna,Lagos,Unity Agro Kaduna Ltd,SUP-074,kg,961.50,97.2,9,73.2,150,"2,000",Fully Match,ISO 9001; HACCP,No,Yes,Inactive,42,75.0,3.7,53.8,Review
7,Wheat Flour,Flours,Ogun,Lagos,Northern Agro Ogun Ltd,SUP-061,kg,"1,012.97",78.9,16,76.8,150,500,Fully Match,SON; ISO 9001,Yes,No,Active,42,88.0,6.8,54.6,Review
8,Rice,Cereals,Lagos,Kebbi,Unity Agro Lagos Ltd,SUP-077,kg,472.69,80.2,3,86.1,20,250,Fully Match,ISO 9001; HACCP,No,Yes,Active,43,89.0,1.1,62.9,Review
8,Rice,Cereals,Oyo,Kebbi,Northern Agro Oyo Ltd,SUP-062,kg,660.72,82.5,9,85.9,5,"5,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,68,76.0,6.2,63.1,Qualified
8,Rice,Cereals,Kogi,Kebbi,Green Harvest Kogi Ltd,SUP-044,kg,532.14,78.9,6,88.8,50,"2,000",Fully Match,ISO 9001; HACCP,No,Yes,Active,36,84.0,5.8,59.3,Review
8,Rice,Cereals,Rivers,Kebbi,Prime Foods Rivers Ltd,SUP-072,kg,590.56,74.6,8,83.7,20,"1,000",Fully Match,NAFDAC; HACCP,Yes,Yes,Active,71,75.0,4.2,63.6,Qualified
9,Sesame Seed,Oilseeds,Plateau,Kano,Northern Agro Plateau Ltd,SUP-063,kg,566.00,79.9,18,68.2,50,250,Fully Match,SON; ISO 9001,Yes,No,Active,48,93.0,5.2,55.3,Review
9,Sesame Seed,Oilseeds,Ondo,Kano,Green Harvest Ondo Ltd,SUP-046,kg,504.57,87.7,12,74.3,50,"5,000",Partial Match,SON; ISO 9001,Yes,No,Active,46,90.0,4.1,64.6,Review
10,Ginger,Spices,Rivers,Kaduna,Green Harvest Rivers Ltd,SUP-048,kg,906.25,72.1,6,87.8,50,500,Partial Match,SON; HACCP,Yes,Yes,Inactive,36,73.0,1.1,67.7,Review
10,Ginger,Spices,Kwara,Kaduna,Prime Foods Kwara Ltd,SUP-067,kg,"1,152.80",95.5,3,93.9,20,"2,000",Fully Match,NAFDAC; SON,Yes,Yes,Active,81,98.0,8.4,71.7,Qualified
10,Ginger,Spices,Kano,Kaduna,Naija Commodities Kano Ltd,SUP-051,kg,"1,189.02",73.0,13,74.5,30,250,Fully Match,ISO 9001; HACCP,No,No,Inactive,54,99.0,8.4,44.5,Review
11,Cocoa Beans,Cocoa,Cross River,Ondo,Prime Foods Cross River Ltd,SUP-065,kg,"1,054.17",97.4,7,95.3,5,500,Fully Match,ISO 9001; HACCP,No,Yes,Inactive,66,78.0,1.9,60.3,Review
11,Cocoa Beans,Cocoa,Kaduna,Ondo,Naija Commodities Kaduna Ltd,SUP-050,kg,993.05,81.9,3,94.6,30,500,Partial Match,SON; ISO 9001,Yes,Yes,Active,64,77.0,0.7,70.0,Review
11,Cocoa Beans,Cocoa,Ogun,Ondo,FreshSource Ogun Ltd,SUP-029,kg,802.89,80.5,4,98.0,50,"1,000",Partial Match,NAFDAC,Yes,Yes,Active,38,73.0,8.0,74.2,Review
11,Cocoa Beans,Cocoa,Plateau,Ondo,AgroLink Plateau Ltd,SUP-007,kg,828.37,87.1,10,69.2,100,"1,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,84,98.0,5.4,64.5,Review
12,Cocoa Powder,Cocoa,Lagos,Lagos,Naija Commodities Lagos Ltd,SUP-053,kg,447.73,90.4,2,84.1,30,"1,000",Partial Match,NAFDAC; SON,Yes,Yes,Active,75,91.0,7.7,73.9,Review
12,Cocoa Powder,Cocoa,Oyo,Lagos,FreshSource Oyo Ltd,SUP-030,kg,542.07,79.8,11,88.7,75,"2,000",Fully Match,SON; HACCP,Yes,No,Active,59,83.0,6.2,63.1,Review
13,Palm Kernel,Oilseeds,Plateau,Ogun,FreshSource Plateau Ltd,SUP-031,kg,659.03,91.5,7,87.1,50,"2,000",Fully Match,SON; ISO 9001,Yes,Yes,Active,61,83.0,7.2,70.9,Qualified
13,Palm Kernel,Oilseeds,Ondo,Ogun,AgroLink Ondo Ltd,SUP-006,kg,723.34,80.4,16,81.7,30,"5,000",Partial Match,ISO 9001; HACCP,No,No,Active,45,79.0,4.9,49.4,Review
13,Palm Kernel,Oilseeds,Kebbi,Ogun,Golden Fields Kebbi Ltd,SUP-034,kg,730.77,80.7,9,88.9,30,500,Fully Match,NAFDAC; SON,Yes,Yes,Active,66,85.0,5.7,65.3,Qualified
14,Palm Oil,Oils,Rivers,Rivers,AgroLink Rivers Ltd,SUP-008,kg,"1,085.63",83.8,8,90.3,100,"2,000",Partial Match,NAFDAC; HACCP,Yes,Yes,Active,35,98.0,6.9,65.9,Review
14,Palm Oil,Oils,Kwara,Rivers,Golden Fields Kwara Ltd,SUP-035,kg,"1,086.25",74.8,15,74.8,150,250,Fully Match,ISO 9001; HACCP,No,No,Active,93,74.0,7.3,45.5,Review
14,Palm Oil,Oils,Kano,Rivers,FarmGate Kano Ltd,SUP-011,kg,"1,045.36",97.7,12,97.5,150,"5,000",Partial Match,ISO 9001; HACCP,No,No,Inactive,55,93.0,7.8,59.6,Review
14,Palm Oil,Oils,Lagos,Rivers,FoodPro Lagos Ltd,SUP-020,kg,958.58,91.5,10,91.7,150,500,Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,71,77.0,2.8,69.6,Qualified
15,Groundnut,Oilseeds,Cross River,Kano,Golden Fields Cross River Ltd,SUP-033,kg,"1,282.55",86.0,6,72.7,100,500,Fully Match,NAFDAC; SON,Yes,Yes,Inactive,87,80.0,5.1,67.0,Review
15,Groundnut,Oilseeds,Kaduna,Kano,FarmGate Kaduna Ltd,SUP-010,kg,"1,336.78",77.4,15,80.1,5,"5,000",Partial Match,NAFDAC; HACCP; ISO 22000,Yes,No,Active,80,79.0,6.9,60.5,Review
16,Groundnut Oil,Oils,Lagos,Kano,FarmGate Lagos Ltd,SUP-013,kg,"1,257.40",96.8,15,84.7,30,"2,000",Fully Match,SON; ISO 9001,Yes,No,Inactive,97,70.0,3.8,62.8,Review
16,Groundnut Oil,Oils,Oyo,Kano,FoodPro Oyo Ltd,SUP-022,kg,"1,174.69",92.8,7,94.1,20,"5,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,45,90.0,4.1,70.5,Qualified
16,Groundnut Oil,Oils,Kogi,Kano,Unity Agro Kogi Ltd,SUP-076,kg,"1,263.41",76.7,10,79.8,30,"2,000",Fully Match,SON; ISO 9001,Yes,Yes,Inactive,70,94.0,8.6,59.4,Review
17,Cashew Nuts,Nuts,Plateau,Kogi,FoodPro Plateau Ltd,SUP-023,kg,"1,083.80",93.7,17,68.6,5,"1,000",Fully Match,NAFDAC,Yes,No,Active,40,94.0,0.8,60.4,Review
17,Cashew Nuts,Nuts,Ondo,Kogi,Unity Agro Ondo Ltd,SUP-078,kg,"1,004.23",93.8,6,75.4,150,250,Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,82,75.0,5.7,70.2,Review
17,Cashew Nuts,Nuts,Kebbi,Kogi,Northern Agro Kebbi Ltd,SUP-058,kg,"1,331.32",90.7,7,97.9,10,"5,000",Fully Match,SON; ISO 9001,Yes,Yes,Inactive,85,92.0,2.2,68.5,Review
17,Cashew Nuts,Nuts,Cross River,Kogi,Green Harvest Cross River Ltd,SUP-041,kg,"1,161.66",93.6,9,71.2,50,"5,000",Fully Match,ISO 9001; HACCP,No,Yes,Active,79,87.0,4.1,54.4,Review
18,Shea Nuts,Nuts,Rivers,Kwara,Unity Agro Rivers Ltd,SUP-080,kg,"1,267.36",85.2,12,68.4,100,"2,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,No,Active,93,92.0,1.8,61.7,Review
18,Shea Nuts,Nuts,Kwara,Kwara,Northern Agro Kwara Ltd,SUP-059,kg,"1,161.28",85.6,10,87.1,150,"2,000",Partial Match,ISO 9001; HACCP,No,Yes,Active,76,97.0,2.6,59.3,Review
19,Honey,Natural Ingredients,Cross River,Oyo,Northern Agro Cross River Ltd,SUP-057,kg,663.26,79.3,16,75.6,150,"5,000",Partial Match,SON; ISO 9001,Yes,No,Active,98,97.0,3.3,54.9,Review
19,Honey,Natural Ingredients,Kaduna,Oyo,Green Harvest Kaduna Ltd,SUP-042,kg,560.55,81.2,10,78.6,50,"5,000",Fully Match,SON; HACCP,Yes,Yes,Active,45,77.0,6.6,63.5,Review
19,Honey,Natural Ingredients,Ogun,Oyo,Prime Foods Ogun Ltd,SUP-069,kg,560.79,91.7,17,88.0,150,"2,000",Fully Match,NAFDAC; SON,Yes,No,Active,63,82.0,6.4,64.2,Review
20,Tigernut,Natural Ingredients,Lagos,Kano,Green Harvest Lagos Ltd,SUP-045,kg,"1,184.81",87.1,17,85.2,75,"2,000",Fully Match,SON; ISO 9001,Yes,No,Inactive,69,79.0,2.6,63.9,Review
20,Tigernut,Natural Ingredients,Oyo,Kano,Prime Foods Oyo Ltd,SUP-070,kg,"1,087.47",77.0,5,91.0,20,500,Fully Match,NAFDAC,Yes,Yes,Inactive,70,93.0,5.5,71.6,Review
20,Tigernut,Natural Ingredients,Kogi,Kano,Naija Commodities Kogi Ltd,SUP-052,kg,"1,422.97",87.5,5,93.8,50,500,Fully Match,NAFDAC; HACCP,Yes,Yes,Active,36,92.0,5.0,69.5,Qualified
20,Tigernut,Natural Ingredients,Rivers,Kano,FreshSource Rivers Ltd,SUP-032,kg,"1,168.08",97.3,11,89.6,20,"2,000",Fully Match,ISO 9001; HACCP,No,No,Active,71,85.0,4.6,61.4,Review
21,Dried Tomato,Vegetables,Plateau,Kaduna,Prime Foods Plateau Ltd,SUP-071,kg,"1,212.54",97.1,10,97.2,150,250,Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Inactive,44,88.0,5.9,73.3,Review
21,Dried Tomato,Vegetables,Ondo,Kaduna,Naija Commodities Ondo Ltd,SUP-054,kg,"1,060.73",75.9,11,70.6,30,250,Partial Match,SON; HACCP,Yes,No,Active,83,84.0,8.2,63.2,Review
22,Chilli Pepper,Spices,Rivers,Kaduna,Naija Commodities Rivers Ltd,SUP-056,kg,"1,148.98",87.3,15,77.5,5,"5,000",Fully Match,ISO 9001; HACCP,No,No,Active,62,78.0,6.1,53.3,Review
22,Chilli Pepper,Spices,Kwara,Kaduna,FreshSource Kwara Ltd,SUP-027,kg,"1,077.33",76.5,4,72.9,100,"2,000",Partial Match,SON; ISO 9001,Yes,Yes,Active,64,79.0,6.5,67.2,Review
22,Chilli Pepper,Spices,Kano,Kaduna,AgroLink Kano Ltd,SUP-003,kg,"1,356.15",83.8,9,96.6,30,"2,000",Fully Match,SON; HACCP,Yes,Yes,Active,54,99.0,2.8,67.4,Qualified
23,Onion,Vegetables,Cross River,Kano,FreshSource Cross River Ltd,SUP-025,kg,741.62,73.6,11,86.4,50,"2,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,No,Active,86,78.0,4.8,65.8,Review
23,Onion,Vegetables,Kaduna,Kano,AgroLink Kaduna Ltd,SUP-002,kg,866.09,74.1,3,95.6,75,"5,000",Fully Match,NAFDAC; SON,Yes,Yes,Active,64,91.0,7.6,70.1,Qualified
23,Onion,Vegetables,Ogun,Kano,Golden Fields Ogun Ltd,SUP-037,kg,894.91,96.7,10,85.9,20,"2,000",Partial Match,SON; ISO 9001,Yes,Yes,Active,90,90.0,7.4,68.4,Review
23,Onion,Vegetables,Plateau,Kano,FarmGate Plateau Ltd,SUP-015,kg,"1,034.36",84.2,15,78.3,10,500,Fully Match,NAFDAC; HACCP; ISO 22000,Yes,No,Inactive,71,91.0,8.5,57.1,Review
24,Potato,Vegetables,Lagos,Plateau,AgroLink Lagos Ltd,SUP-005,kg,"1,252.31",86.3,16,70.7,50,"1,000",Fully Match,ISO 9001; HACCP,No,No,Inactive,100,96.0,8.9,46.4,Review
24,Potato,Vegetables,Oyo,Plateau,Golden Fields Oyo Ltd,SUP-038,kg,"1,181.72",86.1,15,69.7,75,"5,000",Partial Match,NAFDAC,Yes,No,Inactive,41,76.0,2.8,58.0,Review
25,Plantain Flour,Flours,Plateau,Ondo,Golden Fields Plateau Ltd,SUP-039,kg,735.90,79.5,17,71.8,30,500,Fully Match,SON; HACCP,Yes,No,Active,87,72.0,2.4,60.1,Review
25,Plantain Flour,Flours,Ondo,Ondo,FarmGate Ondo Ltd,SUP-014,kg,986.82,74.9,5,88.1,20,"2,000",Fully Match,SON; HACCP,Yes,Yes,Active,88,96.0,4.6,64.3,Qualified
25,Plantain Flour,Flours,Kebbi,Ondo,FoodPro Kebbi Ltd,SUP-018,kg,856.42,83.9,6,79.9,20,250,Fully Match,ISO 9001; HACCP,No,Yes,Inactive,78,99.0,7.2,57.0,Review
26,Yam Flour,Flours,Rivers,Oyo,FarmGate Rivers Ltd,SUP-016,kg,868.82,72.1,11,94.0,150,500,Partial Match,SON; HACCP,Yes,No,Inactive,79,80.0,5.2,66.3,Review
26,Yam Flour,Flours,Kwara,Oyo,FoodPro Kwara Ltd,SUP-019,kg,976.96,83.8,12,95.0,30,"5,000",Partial Match,NAFDAC; HACCP,Yes,No,Inactive,40,80.0,6.8,66.5,Review
26,Yam Flour,Flours,Kano,Oyo,Unity Agro Kano Ltd,SUP-075,kg,"1,040.29",93.1,14,98.6,20,"2,000",Fully Match,NAFDAC; HACCP,Yes,No,Active,47,97.0,7.7,67.2,Review
26,Yam Flour,Flours,Lagos,Oyo,Northern Agro Lagos Ltd,SUP-060,kg,803.27,95.7,2,90.4,100,500,Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,78,89.0,6.4,78.1,Qualified
27,Coconut,Nuts,Cross River,Lagos,FoodPro Cross River Ltd,SUP-017,kg,"1,368.35",94.1,14,97.6,150,"5,000",Fully Match,SON; HACCP,Yes,No,Active,65,90.0,6.3,67.7,Review
27,Coconut,Nuts,Kaduna,Lagos,Unity Agro Kaduna Ltd,SUP-074,kg,"1,177.76",77.9,4,81.5,10,250,Partial Match,NAFDAC; HACCP,Yes,Yes,Active,38,71.0,3.3,68.6,Review
28,Coconut Milk,Ingredients,Lagos,Lagos,Unity Agro Lagos Ltd,SUP-077,kg,392.26,81.3,15,72.5,100,"5,000",Fully Match,NAFDAC; HACCP,Yes,No,Active,45,89.0,7.9,62.6,Review
28,Coconut Milk,Ingredients,Oyo,Lagos,Northern Agro Oyo Ltd,SUP-062,kg,502.33,78.3,6,75.2,50,"2,000",Fully Match,NAFDAC,Yes,Yes,Active,94,98.0,2.9,63.2,Review
28,Coconut Milk,Ingredients,Kogi,Lagos,Green Harvest Kogi Ltd,SUP-044,kg,488.05,73.9,13,98.6,50,"2,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,No,Active,60,82.0,7.8,64.3,Review
29,Bambara Nut,Legumes,Plateau,Kwara,Northern Agro Plateau Ltd,SUP-063,kg,727.29,81.9,13,85.8,50,250,Partial Match,SON; ISO 9001,Yes,No,Active,41,99.0,5.7,66.8,Review
29,Bambara Nut,Legumes,Ondo,Kwara,Green Harvest Ondo Ltd,SUP-046,kg,865.07,95.5,11,92.0,30,"5,000",Fully Match,NAFDAC; HACCP,Yes,No,Active,67,91.0,6.9,69.7,Review
29,Bambara Nut,Legumes,Kebbi,Kwara,Prime Foods Kebbi Ltd,SUP-066,kg,960.71,89.7,6,87.5,5,"1,000",Partial Match,NAFDAC; SON,Yes,Yes,Active,51,72.0,8.2,67.9,Review
29,Bambara Nut,Legumes,Cross River,Kwara,Naija Commodities Cross River Ltd,SUP-049,kg,805.02,82.8,8,72.1,75,"5,000",Fully Match,ISO 9001; HACCP,No,Yes,Active,67,99.0,7.5,54.8,Review
30,Cowpea,Legumes,Rivers,Kano,Green Harvest Rivers Ltd,SUP-048,kg,869.02,93.0,12,92.9,150,250,Fully Match,ISO 9001; HACCP,No,No,Active,85,97.0,7.3,58.8,Review
30,Cowpea,Legumes,Kwara,Kano,Prime Foods Kwara Ltd,SUP-067,kg,827.58,92.6,2,76.2,10,"2,000",Fully Match,NAFDAC,Yes,Yes,Active,83,96.0,5.9,71.5,Review
31,Black-eyed Beans,Legumes,Cross River,Kebbi,Prime Foods Cross River Ltd,SUP-065,kg,901.84,89.5,17,68.8,75,"5,000",Fully Match,NAFDAC,Yes,No,Active,94,99.0,6.5,59.9,Review
31,Black-eyed Beans,Legumes,Kaduna,Kebbi,Naija Commodities Kaduna Ltd,SUP-050,kg,"1,009.64",75.0,3,97.3,50,"2,000",Fully Match,NAFDAC; SON,Yes,Yes,Active,52,82.0,4.4,69.4,Qualified
31,Black-eyed Beans,Legumes,Ogun,Kebbi,FreshSource Ogun Ltd,SUP-029,kg,"1,017.88",91.3,15,86.2,20,"2,000",Fully Match,ISO 9001; HACCP,No,No,Inactive,87,78.0,0.8,53.3,Review
32,Green Gram,Legumes,Lagos,Kano,Naija Commodities Lagos Ltd,SUP-053,kg,"1,095.62",83.5,9,94.5,10,"1,000",Fully Match,NAFDAC; SON,Yes,Yes,Inactive,70,76.0,8.7,69.6,Review
32,Green Gram,Legumes,Oyo,Kano,FreshSource Oyo Ltd,SUP-030,kg,"1,368.47",93.4,4,88.5,5,250,Fully Match,NAFDAC; HACCP,Yes,Yes,Active,61,72.0,7.6,68.7,Qualified
32,Green Gram,Legumes,Kogi,Kano,AgroLink Kogi Ltd,SUP-004,kg,"1,182.26",87.2,9,78.2,20,"5,000",Fully Match,SON; ISO 9001,Yes,Yes,Active,51,87.0,2.6,64.9,Review
32,Green Gram,Legumes,Rivers,Kano,Golden Fields Rivers Ltd,SUP-040,kg,"1,003.16",89.2,2,72.1,75,500,Fully Match,NAFDAC; SON,Yes,Yes,Active,68,71.0,1.6,71.3,Review
33,Rice Bran,Cereals,Plateau,Kebbi,FreshSource Plateau Ltd,SUP-031,kg,792.46,75.0,4,82.8,75,"5,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,40,93.0,7.2,67.1,Qualified
33,Rice Bran,Cereals,Ondo,Kebbi,AgroLink Ondo Ltd,SUP-006,kg,941.38,85.6,16,87.9,5,250,Partial Match,ISO 9001; HACCP,No,No,Inactive,89,91.0,1.4,50.1,Review
34,Maize Flour,Flours,Rivers,Kaduna,AgroLink Rivers Ltd,SUP-008,kg,"1,166.22",83.5,4,78.0,20,250,Fully Match,SON; ISO 9001,Yes,Yes,Active,83,89.0,5.0,65.6,Review
34,Maize Flour,Flours,Kwara,Kaduna,Golden Fields Kwara Ltd,SUP-035,kg,"1,053.00",87.7,5,92.6,10,"5,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Inactive,64,83.0,3.4,71.9,Review
34,Maize Flour,Flours,Kano,Kaduna,FarmGate Kano Ltd,SUP-011,kg,"1,052.91",82.8,5,77.7,75,"1,000",Fully Match,NAFDAC; HACCP,Yes,Yes,Inactive,43,72.0,7.6,66.9,Review
35,Corn Starch,Starch,Cross River,Lagos,Golden Fields Cross River Ltd,SUP-033,kg,612.58,74.5,13,93.2,5,"5,000",Fully Match,NAFDAC,Yes,No,Active,87,81.0,7.9,66.9,Review
35,Corn Starch,Starch,Kaduna,Lagos,FarmGate Kaduna Ltd,SUP-010,kg,866.49,83.0,3,98.0,50,"1,000",Fully Match,SON; HACCP,Yes,Yes,Active,54,91.0,4.6,69.1,Qualified
35,Corn Starch,Starch,Ogun,Lagos,FoodPro Ogun Ltd,SUP-021,kg,838.38,81.1,13,71.6,50,"5,000",Fully Match,ISO 9001; HACCP,No,No,Inactive,38,89.0,8.4,46.9,Review
35,Corn Starch,Starch,Plateau,Lagos,Unity Agro Plateau Ltd,SUP-079,kg,833.05,79.0,7,76.5,50,"1,000",Fully Match,NAFDAC; SON,Yes,Yes,Active,53,88.0,6.1,61.3,Review
36,Cassava Starch,Starch,Lagos,Ogun,FarmGate Lagos Ltd,SUP-013,kg,427.16,91.3,2,70.8,30,"2,000",Partial Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,55,81.0,3.1,72.3,Review
36,Cassava Starch,Starch,Oyo,Ogun,FoodPro Oyo Ltd,SUP-022,kg,480.99,96.5,4,95.4,20,500,Fully Match,NAFDAC,Yes,Yes,Active,69,84.0,6.1,76.5,Qualified
37,Tapioca,Starch,Plateau,Ogun,FoodPro Plateau Ltd,SUP-023,kg,"1,184.74",83.5,10,74.7,10,"1,000",Partial Match,NAFDAC; SON,Yes,Yes,Active,97,86.0,6.2,63.1,Review
37,Tapioca,Starch,Ondo,Ogun,Unity Agro Ondo Ltd,SUP-078,kg,970.81,82.3,3,68.2,50,500,Fully Match,ISO 9001; HACCP,No,Yes,Active,72,80.0,1.5,59.0,Review
37,Tapioca,Starch,Kebbi,Ogun,Northern Agro Kebbi Ltd,SUP-058,kg,"1,190.44",83.2,6,79.8,30,"5,000",Fully Match,NAFDAC; SON,Yes,Yes,Inactive,40,83.0,0.7,66.6,Review
38,Potato Starch,Starch,Rivers,Plateau,Unity Agro Rivers Ltd,SUP-080,kg,753.10,94.4,15,85.8,100,"1,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,No,Active,76,75.0,7.3,61.9,Review
38,Potato Starch,Starch,Kwara,Plateau,Northern Agro Kwara Ltd,SUP-059,kg,673.68,93.6,13,70.7,10,500,Partial Match,SON; HACCP,Yes,No,Inactive,45,82.0,7.9,61.7,Review
38,Potato Starch,Starch,Kano,Plateau,Green Harvest Kano Ltd,SUP-043,kg,707.14,77.8,7,70.4,10,"5,000",Fully Match,ISO 9001; HACCP,No,Yes,Active,79,93.0,8.6,50.2,Review
38,Potato Starch,Starch,Lagos,Plateau,Prime Foods Lagos Ltd,SUP-068,kg,680.84,75.8,5,72.5,30,500,Fully Match,ISO 9001; HACCP,No,Yes,Active,57,94.0,5.8,52.3,Review
39,Moringa Leaf,Botanicals,Cross River,Kaduna,Northern Agro Cross River Ltd,SUP-057,kg,823.05,86.7,16,89.1,75,"1,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,No,Active,95,84.0,5.9,64.1,Review
39,Moringa Leaf,Botanicals,Kaduna,Kaduna,Green Harvest Kaduna Ltd,SUP-042,kg,936.27,87.4,13,83.7,50,"2,000",Partial Match,NAFDAC; SON,Yes,No,Active,82,96.0,2.9,61.9,Review
40,Baobab Powder,Botanicals,Lagos,Kano,Green Harvest Lagos Ltd,SUP-045,kg,809.34,97.4,4,87.1,100,"2,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,76,89.0,4.5,71.9,Qualified
40,Baobab Powder,Botanicals,Oyo,Kano,Prime Foods Oyo Ltd,SUP-070,kg,655.45,73.6,5,93.1,75,250,Fully Match,NAFDAC; SON,Yes,Yes,Active,91,84.0,5.0,71.0,Qualified
40,Baobab Powder,Botanicals,Kogi,Kano,Naija Commodities Kogi Ltd,SUP-052,kg,798.48,81.5,11,80.0,75,"5,000",Fully Match,ISO 9001; HACCP,No,No,Active,43,80.0,1.3,52.3,Review
41,Hibiscus Flower,Botanicals,Plateau,Kano,Prime Foods Plateau Ltd,SUP-071,kg,"1,487.22",79.4,6,78.3,20,"1,000",Fully Match,NAFDAC,Yes,Yes,Inactive,51,89.0,6.5,63.7,Review
41,Hibiscus Flower,Botanicals,Ondo,Kano,Naija Commodities Ondo Ltd,SUP-054,kg,"1,151.61",86.5,12,93.2,10,"2,000",Fully Match,NAFDAC; SON,Yes,No,Active,74,75.0,8.6,70.6,Review
41,Hibiscus Flower,Botanicals,Kebbi,Kano,FreshSource Kebbi Ltd,SUP-026,kg,"1,296.91",91.9,8,75.0,20,500,Fully Match,SON; ISO 9001,Yes,Yes,Active,99,94.0,5.1,67.7,Review
41,Hibiscus Flower,Botanicals,Cross River,Kano,AgroLink Cross River Ltd,SUP-001,kg,"1,521.29",85.7,12,95.2,20,"5,000",Partial Match,NAFDAC; HACCP,Yes,No,Active,58,96.0,6.4,65.4,Review
42,Cloves,Spices,Rivers,Lagos,Naija Commodities Rivers Ltd,SUP-056,kg,593.15,95.5,16,69.4,75,500,Partial Match,SON; HACCP,Yes,No,Active,92,77.0,5.0,60.0,Review
42,Cloves,Spices,Kwara,Lagos,FreshSource Kwara Ltd,SUP-027,kg,520.59,93.0,17,96.0,30,"1,000",Partial Match,NAFDAC; HACCP; ISO 22000,Yes,No,Active,83,86.0,5.0,68.1,Review
43,Cinnamon,Spices,Cross River,Lagos,FreshSource Cross River Ltd,SUP-025,kg,589.63,93.2,6,95.1,5,"2,000",Fully Match,SON; HACCP,Yes,Yes,Active,50,79.0,1.2,69.0,Qualified
43,Cinnamon,Spices,Kaduna,Lagos,AgroLink Kaduna Ltd,SUP-002,kg,426.81,83.7,18,72.6,100,250,Fully Match,ISO 9001; HACCP,No,No,Inactive,79,99.0,0.7,50.5,Review
43,Cinnamon,Spices,Ogun,Lagos,Golden Fields Ogun Ltd,SUP-037,kg,405.18,85.1,9,80.0,10,"1,000",Fully Match,NAFDAC; SON,Yes,Yes,Active,47,96.0,6.6,69.0,Qualified
44,Black Pepper,Spices,Lagos,Cross River,AgroLink Lagos Ltd,SUP-005,kg,951.21,75.8,3,76.9,150,500,Partial Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,45,70.0,2.7,67.2,Review
44,Black Pepper,Spices,Oyo,Cross River,Golden Fields Oyo Ltd,SUP-038,kg,"1,158.98",86.3,18,81.1,50,500,Fully Match,NAFDAC; SON,Yes,No,Active,65,83.0,5.9,57.6,Review
44,Black Pepper,Spices,Kogi,Cross River,FarmGate Kogi Ltd,SUP-012,kg,"1,070.76",73.6,17,86.5,5,"5,000",Fully Match,NAFDAC,Yes,No,Active,72,83.0,0.5,58.2,Review
44,Black Pepper,Spices,Rivers,Cross River,FoodPro Rivers Ltd,SUP-024,kg,958.50,86.8,7,88.6,10,"5,000",Fully Match,NAFDAC; SON,Yes,Yes,Active,84,97.0,4.5,70.3,Qualified
45,Turmeric,Spices,Plateau,Kaduna,Golden Fields Plateau Ltd,SUP-039,kg,"1,035.89",97.5,10,91.2,75,250,Fully Match,NAFDAC; HACCP,Yes,Yes,Active,77,74.0,0.9,69.4,Qualified
45,Turmeric,Spices,Ondo,Kaduna,FarmGate Ondo Ltd,SUP-014,kg,"1,000.01",93.2,7,93.7,150,"2,000",Fully Match,ISO 9001; HACCP,No,Yes,Active,43,92.0,7.1,61.5,Review
46,Nutmeg,Spices,Rivers,Ondo,FarmGate Rivers Ltd,SUP-016,kg,691.35,79.6,3,92.5,5,"1,000",Fully Match,SON; HACCP,Yes,Yes,Inactive,95,78.0,0.8,71.0,Review
46,Nutmeg,Spices,Kwara,Ondo,FoodPro Kwara Ltd,SUP-019,kg,745.63,79.4,3,94.8,75,"1,000",Fully Match,ISO 9001; HACCP,No,Yes,Active,90,98.0,3.9,59.9,Review
46,Nutmeg,Spices,Kano,Ondo,Unity Agro Kano Ltd,SUP-075,kg,686.20,96.9,12,98.2,150,"2,000",Fully Match,ISO 9001; HACCP,No,No,Active,45,93.0,4.1,61.5,Review
47,Garlic,Spices,Cross River,Kano,FoodPro Cross River Ltd,SUP-017,kg,556.48,97.9,7,84.9,75,250,Fully Match,SON; ISO 9001,Yes,Yes,Active,74,84.0,5.6,71.5,Qualified
47,Garlic,Spices,Kaduna,Kano,Unity Agro Kaduna Ltd,SUP-074,kg,555.43,89.9,13,81.9,75,"5,000",Partial Match,SON; ISO 9001,Yes,No,Active,44,91.0,5.9,65.2,Review
47,Garlic,Spices,Ogun,Kano,Northern Agro Ogun Ltd,SUP-061,kg,540.76,92.8,7,97.5,20,"5,000",Partial Match,NAFDAC; SON,Yes,Yes,Active,43,77.0,7.1,73.9,Review
47,Garlic,Spices,Plateau,Kano,Green Harvest Plateau Ltd,SUP-047,kg,541.47,82.0,3,86.8,150,"1,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,52,86.0,3.6,70.9,Qualified
48,Ginger Powder,Spices,Lagos,Kaduna,Unity Agro Lagos Ltd,SUP-077,kg,953.95,79.2,5,68.8,20,"2,000",Partial Match,SON; HACCP,Yes,Yes,Active,68,94.0,2.7,65.0,Review
48,Ginger Powder,Spices,Oyo,Kaduna,Northern Agro Oyo Ltd,SUP-062,kg,"1,009.45",97.9,11,89.5,150,500,Fully Match,NAFDAC; HACCP,Yes,No,Active,92,75.0,8.1,70.1,Review
49,Vanilla,Flavouring,Plateau,Lagos,Northern Agro Plateau Ltd,SUP-063,kg,"1,246.60",74.3,12,88.7,10,"5,000",Fully Match,SON; ISO 9001,Yes,No,Active,57,95.0,3.6,63.4,Review
49,Vanilla,Flavouring,Ondo,Lagos,Green Harvest Ondo Ltd,SUP-046,kg,"1,131.76",97.6,6,75.3,150,250,Fully Match,SON; HACCP,Yes,Yes,Active,94,95.0,8.9,71.3,Review
49,Vanilla,Flavouring,Kebbi,Lagos,Prime Foods Kebbi Ltd,SUP-066,kg,"1,082.64",95.0,4,77.6,150,"5,000",Partial Match,ISO 9001; HACCP,No,Yes,Inactive,44,74.0,8.8,63.3,Review
50,Cocoa Butter,Cocoa,Rivers,Ondo,Green Harvest Rivers Ltd,SUP-048,kg,843.49,83.7,18,78.7,20,500,Partial Match,SON; HACCP,Yes,No,Active,50,86.0,1.8,58.0,Review
50,Cocoa Butter,Cocoa,Kwara,Ondo,Prime Foods Kwara Ltd,SUP-067,kg,688.21,80.4,9,78.7,50,250,Fully Match,NAFDAC; HACCP,Yes,Yes,Active,51,90.0,3.1,66.6,Review
50,Cocoa Butter,Cocoa,Kano,Ondo,Naija Commodities Kano Ltd,SUP-051,kg,808.10,85.1,7,86.3,20,500,Fully Match,ISO 9001; HACCP,No,Yes,Active,38,72.0,0.9,57.8,Review
50,Cocoa Butter,Cocoa,Lagos,Ondo,FreshSource Lagos Ltd,SUP-028,kg,843.20,87.0,8,91.8,100,"5,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,73,85.0,2.6,68.1,Qualified
51,Cocoa Liquor,Cocoa,Cross River,Ondo,Prime Foods Cross River Ltd,SUP-065,kg,"1,460.45",82.6,16,70.3,5,500,Partial Match,NAFDAC; HACCP; ISO 22000,Yes,No,Inactive,94,76.0,3.4,55.4,Review
51,Cocoa Liquor,Cocoa,Kaduna,Ondo,Naija Commodities Kaduna Ltd,SUP-050,kg,"1,109.23",94.4,12,90.8,75,"2,000",Fully Match,ISO 9001; HACCP,No,No,Active,100,87.0,1.4,61.5,Review
52,Soy Protein,Ingredients,Lagos,Lagos,Naija Commodities Lagos Ltd,SUP-053,kg,729.85,75.2,16,75.7,10,250,Fully Match,NAFDAC; HACCP; ISO 22000,Yes,No,Inactive,66,97.0,8.2,59.7,Review
52,Soy Protein,Ingredients,Oyo,Lagos,FreshSource Oyo Ltd,SUP-030,kg,920.04,96.3,12,73.9,20,"2,000",Partial Match,NAFDAC; HACCP; ISO 22000,Yes,No,Active,98,70.0,1.3,62.1,Review
52,Soy Protein,Ingredients,Kogi,Lagos,AgroLink Kogi Ltd,SUP-004,kg,780.25,83.9,9,74.7,75,250,Fully Match,SON; ISO 9001,Yes,Yes,Inactive,95,79.0,5.1,64.5,Review
53,Soy Lecithin,Ingredients,Plateau,Lagos,FreshSource Plateau Ltd,SUP-031,kg,"1,539.14",83.2,10,90.6,100,"1,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,59,81.0,5.2,63.9,Qualified
53,Soy Lecithin,Ingredients,Ondo,Lagos,AgroLink Ondo Ltd,SUP-006,kg,"1,113.81",85.1,10,93.6,10,500,Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,78,87.0,8.5,71.7,Qualified
53,Soy Lecithin,Ingredients,Kebbi,Lagos,Golden Fields Kebbi Ltd,SUP-034,kg,"1,488.44",77.2,18,80.4,5,250,Fully Match,NAFDAC; HACCP,Yes,No,Active,95,86.0,4.4,55.9,Review
53,Soy Lecithin,Ingredients,Cross River,Lagos,FarmGate Cross River Ltd,SUP-009,kg,"1,406.69",85.4,12,96.9,75,500,Partial Match,SON; HACCP,Yes,No,Active,78,86.0,7.5,66.9,Review
54,Peanut Butter,Ingredients,Rivers,Kano,AgroLink Rivers Ltd,SUP-008,kg,"1,049.84",90.4,11,82.7,5,"1,000",Fully Match,NAFDAC,Yes,No,Active,88,88.0,3.1,65.8,Review
54,Peanut Butter,Ingredients,Kwara,Kano,Golden Fields Kwara Ltd,SUP-035,kg,"1,204.67",94.7,2,86.5,50,"5,000",Fully Match,NAFDAC,Yes,Yes,Active,96,75.0,5.0,70.2,Qualified
55,Peanut Flour,Flours,Cross River,Kano,Golden Fields Cross River Ltd,SUP-033,kg,577.17,92.1,14,72.6,30,250,Fully Match,NAFDAC; HACCP,Yes,No,Active,91,80.0,4.1,60.3,Review
55,Peanut Flour,Flours,Kaduna,Kano,FarmGate Kaduna Ltd,SUP-010,kg,510.63,77.3,18,92.0,150,250,Fully Match,SON; HACCP,Yes,No,Active,76,91.0,4.6,61.7,Review
55,Peanut Flour,Flours,Ogun,Kano,FoodPro Ogun Ltd,SUP-021,kg,502.83,96.9,16,96.3,75,"5,000",Fully Match,NAFDAC,Yes,No,Active,96,76.0,8.6,69.1,Review
56,Egg Powder,Ingredients,Lagos,Lagos,FarmGate Lagos Ltd,SUP-013,kg,626.98,79.8,11,91.9,30,"2,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,No,Active,70,79.0,1.5,67.6,Review
56,Egg Powder,Ingredients,Oyo,Lagos,FoodPro Oyo Ltd,SUP-022,kg,738.70,81.9,14,93.4,20,"1,000",Fully Match,SON; ISO 9001,Yes,No,Active,79,99.0,4.3,63.3,Review
56,Egg Powder,Ingredients,Kogi,Lagos,Unity Agro Kogi Ltd,SUP-076,kg,620.64,84.5,8,93.7,50,"5,000",Fully Match,NAFDAC; HACCP,Yes,Yes,Active,65,77.0,0.9,71.2,Qualified
56,Egg Powder,Ingredients,Rivers,Lagos,Northern Agro Rivers Ltd,SUP-064,kg,802.92,77.9,9,69.6,100,"1,000",Partial Match,NAFDAC; SON,Yes,Yes,Active,35,87.0,8.8,57.5,Review
57,Milk Powder,Dairy Ingredients,Plateau,Lagos,FoodPro Plateau Ltd,SUP-023,kg,639.93,89.0,17,82.8,30,"1,000",Fully Match,SON; ISO 9001,Yes,No,Active,46,90.0,5.4,65.0,Review
57,Milk Powder,Dairy Ingredients,Ondo,Lagos,Unity Agro Ondo Ltd,SUP-078,kg,754.32,90.8,3,96.3,20,"2,000",Fully Match,NAFDAC; SON,Yes,Yes,Inactive,98,75.0,8.5,74.1,Review
58,Whey Powder,Dairy Ingredients,Rivers,Lagos,Unity Agro Rivers Ltd,SUP-080,kg,767.51,96.1,3,68.3,10,"1,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Inactive,52,97.0,4.8,64.8,Review
58,Whey Powder,Dairy Ingredients,Kwara,Lagos,Northern Agro Kwara Ltd,SUP-059,kg,585.99,93.0,12,73.0,150,"1,000",Fully Match,NAFDAC; SON,Yes,No,Active,72,88.0,6.2,65.6,Review
58,Whey Powder,Dairy Ingredients,Kano,Lagos,Green Harvest Kano Ltd,SUP-043,kg,565.01,87.9,14,93.6,75,250,Partial Match,NAFDAC,Yes,No,Active,58,74.0,4.6,69.0,Review
59,Butter,Dairy Ingredients,Cross River,Lagos,Northern Agro Cross River Ltd,SUP-057,kg,"1,078.40",72.2,14,75.3,50,"1,000",Fully Match,SON; HACCP,Yes,No,Active,68,90.0,3.6,54.2,Review
59,Butter,Dairy Ingredients,Kaduna,Lagos,Green Harvest Kaduna Ltd,SUP-042,kg,817.21,89.4,16,77.5,100,"5,000",Fully Match,NAFDAC,Yes,No,Active,72,81.0,5.7,63.7,Review
59,Butter,Dairy Ingredients,Ogun,Lagos,Prime Foods Ogun Ltd,SUP-069,kg,810.80,75.5,6,82.1,75,"2,000",Partial Match,ISO 9001; HACCP,No,Yes,Active,66,91.0,6.9,57.6,Review
59,Butter,Dairy Ingredients,Plateau,Lagos,Naija Commodities Plateau Ltd,SUP-055,kg,"1,054.99",74.1,16,84.4,75,250,Fully Match,NAFDAC; SON,Yes,No,Active,54,75.0,3.3,56.3,Review
60,Cheese,Dairy Ingredients,Lagos,Lagos,Green Harvest Lagos Ltd,SUP-045,kg,810.06,75.0,8,90.2,150,250,Partial Match,ISO 9001; HACCP,No,Yes,Active,93,74.0,4.9,55.7,Review
60,Cheese,Dairy Ingredients,Oyo,Lagos,Prime Foods Oyo Ltd,SUP-070,kg,789.25,73.5,16,88.9,50,250,Partial Match,SON; ISO 9001,Yes,No,Active,62,88.0,1.1,60.8,Review
61,Skimmed Milk Powder,Dairy Ingredients,Plateau,Lagos,Prime Foods Plateau Ltd,SUP-071,kg,"1,061.82",90.2,3,97.0,10,"2,000",Fully Match,SON; ISO 9001,Yes,Yes,Inactive,58,94.0,1.7,75.0,Review
61,Skimmed Milk Powder,Dairy Ingredients,Ondo,Lagos,Naija Commodities Ondo Ltd,SUP-054,kg,"1,159.16",91.0,15,79.6,100,"2,000",Partial Match,NAFDAC; HACCP; ISO 22000,Yes,No,Active,52,90.0,7.8,61.9,Review
61,Skimmed Milk Powder,Dairy Ingredients,Kebbi,Lagos,FreshSource Kebbi Ltd,SUP-026,kg,925.49,97.8,14,84.4,30,250,Fully Match,SON; ISO 9001,Yes,No,Inactive,89,87.0,3.7,69.8,Review
62,Sugar,Sweeteners,Rivers,Lagos,Naija Commodities Rivers Ltd,SUP-056,kg,681.85,84.0,6,76.5,10,250,Partial Match,SON; HACCP,Yes,Yes,Active,65,76.0,1.1,68.2,Review
62,Sugar,Sweeteners,Kwara,Lagos,FreshSource Kwara Ltd,SUP-027,kg,795.68,83.6,3,75.6,5,"2,000",Partial Match,NAFDAC; HACCP,Yes,Yes,Active,42,74.0,4.8,66.6,Review
62,Sugar,Sweeteners,Kano,Lagos,AgroLink Kano Ltd,SUP-003,kg,700.47,93.2,12,85.9,75,500,Fully Match,NAFDAC; HACCP,Yes,No,Active,87,79.0,2.8,68.7,Review
62,Sugar,Sweeteners,Lagos,Lagos,Golden Fields Lagos Ltd,SUP-036,kg,784.04,87.4,7,87.4,100,"5,000",Partial Match,NAFDAC; SON,Yes,Yes,Active,83,95.0,5.0,68.4,Review
63,Glucose Syrup,Sweeteners,Cross River,Lagos,FreshSource Cross River Ltd,SUP-025,kg,693.06,82.6,11,79.7,150,500,Fully Match,SON; ISO 9001,Yes,No,Active,94,99.0,1.0,61.7,Review
63,Glucose Syrup,Sweeteners,Kaduna,Lagos,AgroLink Kaduna Ltd,SUP-002,kg,618.84,82.8,18,72.2,30,"1,000",Fully Match,SON; ISO 9001,Yes,No,Active,92,97.0,3.7,58.1,Review
64,Malt Extract,Sweeteners,Lagos,Lagos,AgroLink Lagos Ltd,SUP-005,kg,715.80,93.6,3,76.3,5,250,Fully Match,ISO 9001; HACCP,No,Yes,Active,96,76.0,7.9,59.8,Review
64,Malt Extract,Sweeteners,Oyo,Lagos,Golden Fields Oyo Ltd,SUP-038,kg,657.49,96.9,2,74.6,30,250,Partial Match,NAFDAC; HACCP,Yes,Yes,Active,85,99.0,2.5,72.5,Review
64,Malt Extract,Sweeteners,Kogi,Lagos,FarmGate Kogi Ltd,SUP-012,kg,654.23,79.4,16,84.5,75,"1,000",Fully Match,SON; ISO 9001,Yes,No,Inactive,94,73.0,7.3,62.3,Review
65,Starch Syrup,Sweeteners,Plateau,Lagos,Golden Fields Plateau Ltd,SUP-039,kg,"1,509.87",91.8,12,96.3,75,"1,000",Partial Match,NAFDAC; SON,Yes,No,Active,53,70.0,2.7,67.4,Review
65,Starch Syrup,Sweeteners,Ondo,Lagos,FarmGate Ondo Ltd,SUP-014,kg,"1,629.73",87.1,15,77.2,30,"1,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,No,Active,98,87.0,6.1,57.8,Review
65,Starch Syrup,Sweeteners,Kebbi,Lagos,FoodPro Kebbi Ltd,SUP-018,kg,"1,488.66",78.7,17,98.0,150,"2,000",Fully Match,NAFDAC,Yes,No,Active,56,74.0,6.6,61.8,Review
65,Starch Syrup,Sweeteners,Cross River,Lagos,Unity Agro Cross River Ltd,SUP-073,kg,"1,377.72",95.8,3,84.2,10,250,Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,64,72.0,6.5,72.7,Qualified
66,Baking Soda,Baking Ingredients,Rivers,Lagos,FarmGate Rivers Ltd,SUP-016,kg,977.07,85.1,13,69.9,150,"2,000",Fully Match,NAFDAC; SON,Yes,No,Inactive,36,70.0,5.0,64.5,Review
66,Baking Soda,Baking Ingredients,Kwara,Lagos,FoodPro Kwara Ltd,SUP-019,kg,"1,109.37",97.4,2,83.6,100,500,Fully Match,NAFDAC; SON,Yes,Yes,Active,65,76.0,5.8,75.3,Qualified
67,Baking Powder,Baking Ingredients,Cross River,Lagos,FoodPro Cross River Ltd,SUP-017,kg,565.80,81.2,14,70.4,100,"2,000",Fully Match,NAFDAC,Yes,No,Active,73,91.0,7.5,61.0,Review
67,Baking Powder,Baking Ingredients,Kaduna,Lagos,Unity Agro Kaduna Ltd,SUP-074,kg,521.71,97.8,3,70.9,100,"2,000",Partial Match,NAFDAC; SON,Yes,Yes,Active,56,72.0,4.7,73.3,Review
67,Baking Powder,Baking Ingredients,Ogun,Lagos,Northern Agro Ogun Ltd,SUP-061,kg,612.37,92.4,5,95.7,5,500,Fully Match,ISO 9001; HACCP,No,Yes,Inactive,69,71.0,8.4,64.0,Review
68,Yeast,Baking Ingredients,Lagos,Lagos,Unity Agro Lagos Ltd,SUP-077,kg,550.41,79.3,3,73.6,75,250,Fully Match,SON; HACCP,Yes,Yes,Active,85,99.0,1.2,64.3,Review
68,Yeast,Baking Ingredients,Oyo,Lagos,Northern Agro Oyo Ltd,SUP-062,kg,441.45,78.3,14,89.0,75,"2,000",Fully Match,ISO 9001; HACCP,No,No,Active,99,93.0,8.8,55.7,Review
68,Yeast,Baking Ingredients,Kogi,Lagos,Green Harvest Kogi Ltd,SUP-044,kg,418.75,83.4,4,78.6,100,"1,000",Fully Match,NAFDAC,Yes,Yes,Active,92,85.0,2.4,71.2,Review
68,Yeast,Baking Ingredients,Rivers,Lagos,Prime Foods Rivers Ltd,SUP-072,kg,522.98,81.8,7,89.1,100,250,Fully Match,ISO 9001; HACCP,No,Yes,Active,44,72.0,2.8,57.5,Review
69,Bread Improver,Baking Ingredients,Plateau,Lagos,Northern Agro Plateau Ltd,SUP-063,kg,"1,066.78",92.4,6,90.9,75,"1,000",Fully Match,NAFDAC; SON,Yes,Yes,Active,74,84.0,3.6,72.6,Qualified
69,Bread Improver,Baking Ingredients,Ondo,Lagos,Green Harvest Ondo Ltd,SUP-046,kg,"1,016.37",75.4,7,81.4,100,250,Fully Match,NAFDAC; SON,Yes,Yes,Active,46,89.0,5.6,66.3,Qualified
70,Citric Acid,Acidulants,Rivers,Lagos,Green Harvest Rivers Ltd,SUP-048,kg,673.21,82.0,11,80.8,10,"5,000",Fully Match,SON; HACCP,Yes,No,Active,83,75.0,1.7,65.0,Review
70,Citric Acid,Acidulants,Kwara,Lagos,Prime Foods Kwara Ltd,SUP-067,kg,666.32,84.8,4,73.2,50,"2,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,81,78.0,8.5,68.2,Review
70,Citric Acid,Acidulants,Kano,Lagos,Naija Commodities Kano Ltd,SUP-051,kg,790.44,84.9,8,82.2,20,"1,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,83,95.0,7.8,64.5,Qualified
71,Lactic Acid,Acidulants,Cross River,Lagos,Prime Foods Cross River Ltd,SUP-065,kg,711.46,83.2,6,77.3,30,"2,000",Fully Match,NAFDAC; HACCP,Yes,Yes,Inactive,75,79.0,6.7,66.4,Review
71,Lactic Acid,Acidulants,Kaduna,Lagos,Naija Commodities Kaduna Ltd,SUP-050,kg,768.76,97.2,9,78.1,50,"2,000",Fully Match,NAFDAC; SON,Yes,Yes,Active,58,91.0,7.0,66.7,Review
71,Lactic Acid,Acidulants,Ogun,Lagos,FreshSource Ogun Ltd,SUP-029,kg,588.56,90.9,8,81.6,50,250,Partial Match,NAFDAC,Yes,Yes,Inactive,52,90.0,3.1,71.7,Review
71,Lactic Acid,Acidulants,Plateau,Lagos,AgroLink Plateau Ltd,SUP-007,kg,655.70,76.0,15,92.5,10,"2,000",Partial Match,SON; HACCP,Yes,No,Inactive,99,99.0,8.3,64.6,Review
72,Ascorbic Acid,Acidulants,Lagos,Lagos,Naija Commodities Lagos Ltd,SUP-053,kg,"1,029.45",86.1,13,89.8,10,250,Fully Match,NAFDAC,Yes,No,Active,56,90.0,5.7,64.0,Review
72,Ascorbic Acid,Acidulants,Oyo,Lagos,FreshSource Oyo Ltd,SUP-030,kg,979.42,88.8,14,98.0,75,"2,000",Fully Match,NAFDAC; SON,Yes,No,Active,68,77.0,4.8,67.2,Review
73,Pectin,Hydrocolloids,Plateau,Lagos,FreshSource Plateau Ltd,SUP-031,kg,"1,090.83",87.1,9,81.8,100,"2,000",Fully Match,SON; ISO 9001,Yes,Yes,Active,96,73.0,3.0,66.1,Qualified
73,Pectin,Hydrocolloids,Ondo,Lagos,AgroLink Ondo Ltd,SUP-006,kg,"1,268.17",74.2,6,78.8,75,"2,000",Fully Match,SON; HACCP,Yes,Yes,Inactive,79,85.0,1.3,60.5,Review
73,Pectin,Hydrocolloids,Kebbi,Lagos,Golden Fields Kebbi Ltd,SUP-034,kg,"1,180.52",83.8,4,77.3,10,250,Fully Match,NAFDAC,Yes,Yes,Active,56,99.0,8.9,65.4,Review
74,Xanthan Gum,Hydrocolloids,Rivers,Lagos,AgroLink Rivers Ltd,SUP-008,kg,"1,078.34",76.5,7,78.3,100,"2,000",Fully Match,ISO 9001; HACCP,No,Yes,Inactive,58,75.0,5.9,56.1,Review
74,Xanthan Gum,Hydrocolloids,Kwara,Lagos,Golden Fields Kwara Ltd,SUP-035,kg,"1,170.75",72.8,8,81.9,100,"2,000",Fully Match,NAFDAC,Yes,Yes,Active,61,78.0,6.9,63.8,Qualified
74,Xanthan Gum,Hydrocolloids,Kano,Lagos,FarmGate Kano Ltd,SUP-011,kg,"1,355.65",73.6,5,92.8,20,"1,000",Fully Match,NAFDAC; HACCP,Yes,Yes,Inactive,49,78.0,6.2,65.4,Review
74,Xanthan Gum,Hydrocolloids,Lagos,Lagos,FoodPro Lagos Ltd,SUP-020,kg,"1,198.91",97.1,12,86.5,100,"5,000",Fully Match,SON; ISO 9001,Yes,No,Active,93,89.0,2.0,68.2,Review
75,Guar Gum,Hydrocolloids,Cross River,Lagos,Golden Fields Cross River Ltd,SUP-033,kg,549.25,92.8,4,88.8,75,250,Fully Match,SON; ISO 9001,Yes,Yes,Active,58,81.0,6.4,70.9,Qualified
75,Guar Gum,Hydrocolloids,Kaduna,Lagos,FarmGate Kaduna Ltd,SUP-010,kg,515.20,82.9,6,85.8,100,500,Partial Match,NAFDAC,Yes,Yes,Active,56,85.0,3.0,67.9,Review
76,Gelatin,Hydrocolloids,Lagos,Lagos,FarmGate Lagos Ltd,SUP-013,kg,513.99,93.9,3,94.8,5,"2,000",Fully Match,NAFDAC; HACCP,Yes,Yes,Inactive,99,90.0,4.7,77.4,Review
76,Gelatin,Hydrocolloids,Oyo,Lagos,FoodPro Oyo Ltd,SUP-022,kg,633.53,82.8,16,83.1,10,"5,000",Fully Match,ISO 9001; HACCP,No,No,Active,72,71.0,2.8,49.7,Review
76,Gelatin,Hydrocolloids,Kogi,Lagos,Unity Agro Kogi Ltd,SUP-076,kg,598.20,76.4,16,85.5,150,"5,000",Fully Match,SON; HACCP,Yes,No,Active,69,94.0,5.1,60.0,Review
77,Cocoa Nibs,Cocoa,Plateau,Ondo,FoodPro Plateau Ltd,SUP-023,kg,"1,598.37",86.1,3,91.6,150,"5,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,66,79.0,7.9,67.9,Qualified
77,Cocoa Nibs,Cocoa,Ondo,Ondo,Unity Agro Ondo Ltd,SUP-078,kg,"1,077.76",78.8,4,81.6,10,500,Fully Match,ISO 9001; HACCP,No,Yes,Active,89,75.0,5.7,61.0,Review
77,Cocoa Nibs,Cocoa,Kebbi,Ondo,Northern Agro Kebbi Ltd,SUP-058,kg,"1,486.48",93.2,3,85.7,50,"5,000",Fully Match,SON; ISO 9001,Yes,Yes,Active,72,88.0,2.8,69.9,Qualified
77,Cocoa Nibs,Cocoa,Cross River,Ondo,Green Harvest Cross River Ltd,SUP-041,kg,"1,526.21",97.6,5,72.2,100,250,Fully Match,ISO 9001; HACCP,No,Yes,Active,51,77.0,1.7,55.8,Review
78,Desiccated Coconut,Nuts,Rivers,Lagos,Unity Agro Rivers Ltd,SUP-080,kg,686.85,78.4,14,83.2,50,"2,000",Partial Match,NAFDAC; HACCP; ISO 22000,Yes,No,Active,46,82.0,4.9,62.9,Review
78,Desiccated Coconut,Nuts,Kwara,Lagos,Northern Agro Kwara Ltd,SUP-059,kg,673.60,96.3,13,82.1,150,"1,000",Fully Match,ISO 9001; HACCP,No,No,Active,93,90.0,6.1,58.1,Review
79,Dried Banana,Fruit Ingredients,Cross River,Ondo,Northern Agro Cross River Ltd,SUP-057,kg,"1,302.35",73.6,14,74.8,100,500,Partial Match,SON; ISO 9001,Yes,No,Active,71,80.0,5.2,59.3,Review
79,Dried Banana,Fruit Ingredients,Kaduna,Ondo,Green Harvest Kaduna Ltd,SUP-042,kg,"1,174.05",94.2,12,95.7,5,250,Fully Match,NAFDAC,Yes,No,Inactive,37,73.0,8.4,72.8,Review
79,Dried Banana,Fruit Ingredients,Ogun,Ondo,Prime Foods Ogun Ltd,SUP-069,kg,"1,189.49",83.9,15,74.3,20,"1,000",Fully Match,ISO 9001; HACCP,No,No,Active,46,90.0,3.6,52.8,Review
80,Dried Mango,Fruit Ingredients,Lagos,Kaduna,Green Harvest Lagos Ltd,SUP-045,kg,"1,087.07",89.3,7,69.6,50,500,Partial Match,NAFDAC,Yes,Yes,Active,47,70.0,2.3,68.4,Review
80,Dried Mango,Fruit Ingredients,Oyo,Kaduna,Prime Foods Oyo Ltd,SUP-070,kg,"1,084.68",87.4,18,89.1,5,250,Fully Match,ISO 9001; HACCP,No,No,Active,89,92.0,1.6,56.3,Review
80,Dried Mango,Fruit Ingredients,Kogi,Kaduna,Naija Commodities Kogi Ltd,SUP-052,kg,"1,080.88",82.0,5,71.2,75,"1,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,53,72.0,5.0,68.3,Review
80,Dried Mango,Fruit Ingredients,Rivers,Kaduna,FreshSource Rivers Ltd,SUP-032,kg,"1,047.57",88.9,16,78.9,30,500,Partial Match,SON; HACCP,Yes,No,Inactive,62,72.0,8.1,65.9,Review
81,Pineapple Pieces,Fruit Ingredients,Plateau,Ogun,Prime Foods Plateau Ltd,SUP-071,kg,646.80,75.2,14,78.9,100,"1,000",Fully Match,NAFDAC; HACCP,Yes,No,Active,45,77.0,5.2,62.5,Review
81,Pineapple Pieces,Fruit Ingredients,Ondo,Ogun,Naija Commodities Ondo Ltd,SUP-054,kg,788.99,87.8,2,94.3,50,500,Fully Match,NAFDAC,Yes,Yes,Inactive,72,90.0,1.0,72.9,Review
82,Raisin,Fruit Ingredients,Rivers,Lagos,Naija Commodities Rivers Ltd,SUP-056,kg,"1,194.73",96.8,17,80.0,30,"2,000",Fully Match,SON; HACCP,Yes,No,Active,81,99.0,3.2,60.1,Review
82,Raisin,Fruit Ingredients,Kwara,Lagos,FreshSource Kwara Ltd,SUP-027,kg,980.51,93.8,15,79.3,20,"2,000",Fully Match,NAFDAC; SON,Yes,No,Active,36,78.0,2.3,64.6,Review
82,Raisin,Fruit Ingredients,Kano,Lagos,AgroLink Kano Ltd,SUP-003,kg,"1,205.07",96.7,14,83.7,100,"2,000",Partial Match,NAFDAC; SON,Yes,No,Active,70,72.0,3.1,62.6,Review
83,Date,Fruit Ingredients,Cross River,Kano,FreshSource Cross River Ltd,SUP-025,kg,877.47,77.3,6,84.6,100,"5,000",Fully Match,SON; ISO 9001,Yes,Yes,Inactive,65,71.0,2.6,66.2,Review
83,Date,Fruit Ingredients,Kaduna,Kano,AgroLink Kaduna Ltd,SUP-002,kg,"1,024.68",75.0,3,77.6,20,250,Fully Match,NAFDAC,Yes,Yes,Active,36,75.0,4.7,62.2,Review
83,Date,Fruit Ingredients,Ogun,Kano,Golden Fields Ogun Ltd,SUP-037,kg,818.84,85.4,10,73.2,20,"1,000",Fully Match,ISO 9001; HACCP,No,Yes,Active,77,95.0,4.1,54.3,Review
83,Date,Fruit Ingredients,Plateau,Kano,FarmGate Plateau Ltd,SUP-015,kg,881.94,78.8,4,83.4,75,250,Partial Match,ISO 9001; HACCP,No,Yes,Active,82,75.0,2.7,57.3,Review
84,Date Syrup,Sweeteners,Lagos,Kano,AgroLink Lagos Ltd,SUP-005,kg,"1,041.91",86.9,5,75.1,5,250,Fully Match,NAFDAC; HACCP,Yes,Yes,Active,95,81.0,3.8,70.2,Review
84,Date Syrup,Sweeteners,Oyo,Kano,Golden Fields Oyo Ltd,SUP-038,kg,"1,065.82",96.2,3,85.1,100,500,Fully Match,NAFDAC; HACCP,Yes,Yes,Inactive,75,78.0,7.5,75.9,Review
85,Fruit Puree,Fruit Ingredients,Plateau,Lagos,Golden Fields Plateau Ltd,SUP-039,kg,664.65,75.1,3,73.6,5,"2,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,74,80.0,1.2,64.2,Review
85,Fruit Puree,Fruit Ingredients,Ondo,Lagos,FarmGate Ondo Ltd,SUP-014,kg,634.42,81.6,11,85.5,50,"5,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,No,Active,98,94.0,7.1,64.9,Review
85,Fruit Puree,Fruit Ingredients,Kebbi,Lagos,FoodPro Kebbi Ltd,SUP-018,kg,707.03,86.2,9,72.7,100,250,Fully Match,SON; HACCP,Yes,Yes,Active,36,80.0,0.5,61.8,Review
86,Tomato Paste,Vegetables,Rivers,Kaduna,FarmGate Rivers Ltd,SUP-016,kg,"1,301.03",94.1,11,71.2,30,"2,000",Partial Match,NAFDAC; SON,Yes,No,Active,70,72.0,0.9,62.8,Review
86,Tomato Paste,Vegetables,Kwara,Kaduna,FoodPro Kwara Ltd,SUP-019,kg,"1,088.74",94.0,15,89.7,75,"2,000",Fully Match,SON; HACCP,Yes,No,Active,99,74.0,5.9,68.6,Review
86,Tomato Paste,Vegetables,Kano,Kaduna,Unity Agro Kano Ltd,SUP-075,kg,"1,169.94",87.4,3,81.5,20,500,Fully Match,SON; ISO 9001,Yes,Yes,Active,85,92.0,7.6,70.7,Qualified
86,Tomato Paste,Vegetables,Lagos,Kaduna,Northern Agro Lagos Ltd,SUP-060,kg,"1,135.99",83.8,9,70.3,30,500,Fully Match,NAFDAC; HACCP,Yes,Yes,Active,56,84.0,4.5,64.0,Review
87,Tomato Powder,Vegetables,Cross River,Kaduna,FoodPro Cross River Ltd,SUP-017,kg,"1,033.34",85.9,8,82.0,150,"1,000",Fully Match,NAFDAC; SON,Yes,Yes,Active,73,96.0,6.5,67.4,Qualified
87,Tomato Powder,Vegetables,Kaduna,Kaduna,Unity Agro Kaduna Ltd,SUP-074,kg,"1,119.54",77.6,12,72.6,30,"1,000",Partial Match,SON; HACCP,Yes,No,Active,73,78.0,7.5,58.9,Review
88,Carrot Powder,Vegetables,Lagos,Plateau,Unity Agro Lagos Ltd,SUP-077,kg,"1,139.50",96.8,16,85.2,30,250,Partial Match,NAFDAC; SON,Yes,No,Active,50,70.0,1.0,68.0,Review
88,Carrot Powder,Vegetables,Oyo,Plateau,Northern Agro Oyo Ltd,SUP-062,kg,"1,464.85",77.8,8,93.5,75,250,Fully Match,ISO 9001; HACCP,No,Yes,Active,37,72.0,2.2,55.1,Review
88,Carrot Powder,Vegetables,Kogi,Plateau,Green Harvest Kogi Ltd,SUP-044,kg,"1,392.52",93.0,4,96.1,75,250,Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,56,99.0,5.4,73.0,Qualified
89,Beetroot Powder,Vegetables,Plateau,Plateau,Northern Agro Plateau Ltd,SUP-063,kg,"1,338.71",82.3,2,79.9,100,500,Fully Match,NAFDAC; HACCP,Yes,Yes,Active,70,78.0,4.3,66.0,Review
89,Beetroot Powder,Vegetables,Ondo,Plateau,Green Harvest Ondo Ltd,SUP-046,kg,"1,013.91",88.0,9,88.1,150,"2,000",Partial Match,NAFDAC; SON,Yes,Yes,Active,70,82.0,1.7,71.0,Review
89,Beetroot Powder,Vegetables,Kebbi,Plateau,Prime Foods Kebbi Ltd,SUP-066,kg,"1,038.43",95.0,18,75.7,5,"2,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,No,Inactive,79,99.0,5.3,63.8,Review
89,Beetroot Powder,Vegetables,Cross River,Plateau,Naija Commodities Cross River Ltd,SUP-049,kg,"1,097.38",79.0,2,77.9,30,250,Fully Match,NAFDAC; SON,Yes,Yes,Inactive,80,94.0,5.5,68.9,Review
90,Pea Protein,Ingredients,Rivers,Lagos,Green Harvest Rivers Ltd,SUP-048,kg,"1,065.52",76.2,9,88.4,50,"5,000",Fully Match,ISO 9001; HACCP,No,Yes,Active,84,81.0,8.4,57.4,Review
90,Pea Protein,Ingredients,Kwara,Lagos,Prime Foods Kwara Ltd,SUP-067,kg,"1,435.52",76.5,9,86.4,75,"5,000",Fully Match,NAFDAC,Yes,Yes,Active,53,88.0,8.6,60.6,Qualified
91,Flaxseed,Oilseeds,Cross River,Kano,Prime Foods Cross River Ltd,SUP-065,kg,"1,034.36",93.1,17,84.8,20,"2,000",Fully Match,NAFDAC; SON,Yes,No,Active,64,89.0,2.4,60.8,Review
91,Flaxseed,Oilseeds,Kaduna,Kano,Naija Commodities Kaduna Ltd,SUP-050,kg,919.30,72.0,8,93.0,75,500,Fully Match,NAFDAC; SON,Yes,Yes,Active,53,88.0,6.5,65.6,Qualified
91,Flaxseed,Oilseeds,Ogun,Kano,FreshSource Ogun Ltd,SUP-029,kg,776.59,74.9,18,94.7,10,"1,000",Partial Match,SON; HACCP,Yes,No,Active,78,79.0,3.2,64.0,Review
92,Chia Seed,Oilseeds,Lagos,Kano,Naija Commodities Lagos Ltd,SUP-053,kg,846.14,91.0,15,92.5,150,"1,000",Fully Match,NAFDAC,Yes,No,Active,63,91.0,5.5,62.3,Review
92,Chia Seed,Oilseeds,Oyo,Kano,FreshSource Oyo Ltd,SUP-030,kg,614.83,80.0,11,71.9,5,"5,000",Partial Match,ISO 9001; HACCP,No,No,Active,58,89.0,3.2,53.5,Review
92,Chia Seed,Oilseeds,Kogi,Kano,AgroLink Kogi Ltd,SUP-004,kg,797.87,87.9,5,97.0,20,"1,000",Fully Match,NAFDAC; HACCP,Yes,Yes,Active,75,75.0,5.9,70.0,Qualified
92,Chia Seed,Oilseeds,Rivers,Kano,Golden Fields Rivers Ltd,SUP-040,kg,842.45,93.4,12,81.8,50,500,Fully Match,NAFDAC,Yes,No,Active,79,78.0,7.2,62.1,Review
93,Sunflower Seed,Oilseeds,Plateau,Kano,FreshSource Plateau Ltd,SUP-031,kg,"1,136.04",73.3,16,90.7,20,"2,000",Partial Match,NAFDAC; HACCP; ISO 22000,Yes,No,Active,83,73.0,7.5,58.9,Review
93,Sunflower Seed,Oilseeds,Ondo,Kano,AgroLink Ondo Ltd,SUP-006,kg,"1,165.08",87.0,9,73.0,10,250,Fully Match,NAFDAC; SON,Yes,Yes,Active,68,73.0,1.1,61.6,Review
94,Pumpkin Seed,Oilseeds,Rivers,Plateau,AgroLink Rivers Ltd,SUP-008,kg,445.72,81.8,4,85.0,10,"1,000",Partial Match,NAFDAC,Yes,Yes,Active,90,90.0,1.9,71.5,Review
94,Pumpkin Seed,Oilseeds,Kwara,Plateau,Golden Fields Kwara Ltd,SUP-035,kg,596.85,76.1,5,78.3,30,"2,000",Fully Match,NAFDAC,Yes,Yes,Active,73,77.0,1.3,61.7,Review
94,Pumpkin Seed,Oilseeds,Kano,Plateau,FarmGate Kano Ltd,SUP-011,kg,492.51,86.3,17,72.8,75,250,Partial Match,NAFDAC; SON,Yes,No,Active,96,76.0,1.3,59.9,Review
95,Quinoa,Cereals,Cross River,Lagos,Golden Fields Cross River Ltd,SUP-033,kg,748.21,88.6,4,82.7,10,"1,000",Partial Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Inactive,68,72.0,6.0,72.3,Review
95,Quinoa,Cereals,Kaduna,Lagos,FarmGate Kaduna Ltd,SUP-010,kg,810.78,81.6,14,79.5,150,250,Fully Match,NAFDAC; HACCP; ISO 22000,Yes,No,Inactive,68,77.0,7.6,62.2,Review
95,Quinoa,Cereals,Ogun,Lagos,FoodPro Ogun Ltd,SUP-021,kg,872.01,75.9,5,70.7,75,"5,000",Partial Match,ISO 9001; HACCP,No,Yes,Active,42,96.0,3.8,52.5,Review
95,Quinoa,Cereals,Plateau,Lagos,Unity Agro Plateau Ltd,SUP-079,kg,857.57,97.1,17,85.8,30,"2,000",Fully Match,NAFDAC; SON,Yes,No,Inactive,39,86.0,5.4,64.7,Review
96,Oat Flakes,Cereals,Lagos,Lagos,FarmGate Lagos Ltd,SUP-013,kg,808.91,86.9,6,71.7,150,500,Fully Match,NAFDAC; HACCP,Yes,Yes,Active,51,71.0,4.1,65.3,Review
96,Oat Flakes,Cereals,Oyo,Lagos,FoodPro Oyo Ltd,SUP-022,kg,963.36,83.3,6,93.9,50,"1,000",Fully Match,NAFDAC; SON,Yes,Yes,Inactive,85,87.0,3.3,66.0,Review
97,Barley,Cereals,Plateau,Lagos,FoodPro Plateau Ltd,SUP-023,kg,448.35,83.9,2,92.4,100,250,Partial Match,NAFDAC; HACCP,Yes,Yes,Active,47,99.0,1.4,74.2,Review
97,Barley,Cereals,Ondo,Lagos,Unity Agro Ondo Ltd,SUP-078,kg,549.61,92.4,13,95.2,50,"2,000",Partial Match,SON; HACCP,Yes,No,Inactive,39,75.0,2.8,66.2,Review
97,Barley,Cereals,Kebbi,Lagos,Northern Agro Kebbi Ltd,SUP-058,kg,421.72,87.8,14,69.2,75,500,Fully Match,NAFDAC,Yes,No,Inactive,69,98.0,3.7,63.2,Review
98,Buckwheat,Cereals,Rivers,Lagos,Unity Agro Rivers Ltd,SUP-080,kg,896.49,92.6,11,76.7,150,250,Fully Match,NAFDAC; HACCP,Yes,No,Active,91,94.0,7.5,66.5,Review
98,Buckwheat,Cereals,Kwara,Lagos,Northern Agro Kwara Ltd,SUP-059,kg,869.70,82.8,4,73.8,30,"2,000",Partial Match,ISO 9001; HACCP,No,Yes,Active,42,86.0,7.2,58.1,Review
98,Buckwheat,Cereals,Kano,Lagos,Green Harvest Kano Ltd,SUP-043,kg,789.93,90.4,14,72.2,5,500,Fully Match,ISO 9001; HACCP,No,No,Active,42,77.0,0.8,55.3,Review
98,Buckwheat,Cereals,Lagos,Lagos,Prime Foods Lagos Ltd,SUP-068,kg,784.03,81.4,8,76.5,150,"5,000",Partial Match,NAFDAC,Yes,Yes,Active,38,77.0,3.7,67.9,Review
99,Almond,Nuts,Cross River,Lagos,Northern Agro Cross River Ltd,SUP-057,kg,628.87,76.6,17,86.2,75,"1,000",Fully Match,ISO 9001; HACCP,No,No,Active,46,79.0,0.7,49.1,Review
99,Almond,Nuts,Kaduna,Lagos,Green Harvest Kaduna Ltd,SUP-042,kg,494.42,94.2,8,94.6,30,500,Fully Match,NAFDAC,Yes,Yes,Inactive,100,70.0,7.8,75.6,Review
100,Cashew Kernel,Nuts,Lagos,Kogi,Green Harvest Lagos Ltd,SUP-045,kg,589.80,89.7,17,96.3,20,"5,000",Fully Match,NAFDAC; HACCP,Yes,No,Active,74,92.0,8.7,61.8,Review
100,Cashew Kernel,Nuts,Oyo,Kogi,Prime Foods Oyo Ltd,SUP-070,kg,524.27,83.0,14,94.4,150,"1,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,No,Active,85,88.0,1.4,64.2,Review
100,Cashew Kernel,Nuts,Kogi,Kogi,Naija Commodities Kogi Ltd,SUP-052,kg,497.76,89.2,13,85.4,50,"1,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,No,Active,78,78.0,5.9,65.2,Review
101,Sesame Oil,Oils,Plateau,Kano,Prime Foods Plateau Ltd,SUP-071,kg,606.28,78.8,11,73.8,30,250,Partial Match,NAFDAC,Yes,No,Active,52,93.0,0.7,57.9,Review
101,Sesame Oil,Oils,Ondo,Kano,Naija Commodities Ondo Ltd,SUP-054,kg,527.82,79.7,15,80.5,5,"5,000",Fully Match,SON; ISO 9001,Yes,No,Active,95,99.0,8.5,60.5,Review
101,Sesame Oil,Oils,Kebbi,Kano,FreshSource Kebbi Ltd,SUP-026,kg,497.90,79.8,7,94.1,20,"1,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,68,93.0,7.4,69.9,Qualified
101,Sesame Oil,Oils,Cross River,Kano,AgroLink Cross River Ltd,SUP-001,kg,585.04,76.8,12,88.3,30,"1,000",Fully Match,NAFDAC,Yes,No,Active,88,95.0,8.0,61.3,Review
102,Avocado Oil,Oils,Rivers,Lagos,Naija Commodities Rivers Ltd,SUP-056,kg,888.26,87.2,16,94.4,150,250,Fully Match,NAFDAC; HACCP; ISO 22000,Yes,No,Active,99,73.0,7.9,66.3,Review
102,Avocado Oil,Oils,Kwara,Lagos,FreshSource Kwara Ltd,SUP-027,kg,892.07,79.8,3,95.0,20,500,Fully Match,SON; ISO 9001,Yes,Yes,Inactive,93,74.0,3.2,72.3,Review
103,Soybean Oil,Oils,Cross River,Kano,FreshSource Cross River Ltd,SUP-025,kg,648.82,92.3,17,78.3,20,"1,000",Fully Match,NAFDAC; SON,Yes,No,Inactive,70,76.0,7.0,60.0,Review
103,Soybean Oil,Oils,Kaduna,Kano,AgroLink Kaduna Ltd,SUP-002,kg,515.78,91.9,17,92.3,10,500,Partial Match,NAFDAC,Yes,No,Inactive,86,83.0,8.7,68.0,Review
103,Soybean Oil,Oils,Ogun,Kano,Golden Fields Ogun Ltd,SUP-037,kg,567.99,73.0,8,90.7,5,"1,000",Fully Match,NAFDAC; SON,Yes,Yes,Active,66,77.0,6.4,66.5,Qualified
104,Palm Olein,Oils,Lagos,Rivers,AgroLink Lagos Ltd,SUP-005,kg,"1,185.53",75.4,14,83.6,50,500,Fully Match,ISO 9001; HACCP,No,No,Active,73,79.0,4.4,52.1,Review
104,Palm Olein,Oils,Oyo,Rivers,Golden Fields Oyo Ltd,SUP-038,kg,"1,276.34",85.6,15,95.5,20,"1,000",Partial Match,SON; ISO 9001,Yes,No,Active,56,99.0,8.3,65.5,Review
104,Palm Olein,Oils,Kogi,Rivers,FarmGate Kogi Ltd,SUP-012,kg,"1,216.00",77.9,6,74.5,5,"5,000",Fully Match,NAFDAC; SON,Yes,Yes,Active,39,82.0,8.0,64.7,Review
104,Palm Olein,Oils,Rivers,Rivers,FoodPro Rivers Ltd,SUP-024,kg,"1,139.81",85.9,3,86.4,5,250,Fully Match,NAFDAC; SON,Yes,Yes,Active,88,84.0,3.7,72.7,Qualified
105,Palm Stearin,Oils,Plateau,Rivers,Golden Fields Plateau Ltd,SUP-039,kg,573.22,84.3,6,74.4,5,"1,000",Partial Match,NAFDAC,Yes,Yes,Active,69,89.0,5.6,65.1,Review
105,Palm Stearin,Oils,Ondo,Rivers,FarmGate Ondo Ltd,SUP-014,kg,479.17,93.6,5,83.9,10,"1,000",Fully Match,ISO 9001; HACCP,No,Yes,Active,98,76.0,5.7,63.8,Review
106,Fish Meal,Protein Ingredients,Rivers,Lagos,FarmGate Rivers Ltd,SUP-016,kg,636.44,93.6,8,79.1,100,"1,000",Fully Match,NAFDAC; SON,Yes,Yes,Inactive,61,92.0,8.4,65.4,Review
106,Fish Meal,Protein Ingredients,Kwara,Lagos,FoodPro Kwara Ltd,SUP-019,kg,532.16,72.1,4,96.1,150,500,Fully Match,ISO 9001; HACCP,No,Yes,Active,47,98.0,2.7,60.5,Review
106,Fish Meal,Protein Ingredients,Kano,Lagos,Unity Agro Kano Ltd,SUP-075,kg,508.98,97.7,11,76.2,5,250,Fully Match,ISO 9001; HACCP,No,No,Active,72,81.0,7.3,58.5,Review
107,Chicken Powder,Protein Ingredients,Cross River,Lagos,FoodPro Cross River Ltd,SUP-017,kg,924.70,91.2,5,94.4,5,250,Fully Match,NAFDAC,Yes,Yes,Active,77,81.0,8.1,74.4,Qualified
107,Chicken Powder,Protein Ingredients,Kaduna,Lagos,Unity Agro Kaduna Ltd,SUP-074,kg,"1,186.95",79.0,4,79.6,75,500,Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Inactive,93,78.0,7.6,62.8,Review
107,Chicken Powder,Protein Ingredients,Ogun,Lagos,Northern Agro Ogun Ltd,SUP-061,kg,"1,078.69",84.4,15,88.1,20,250,Fully Match,NAFDAC,Yes,No,Active,55,73.0,4.0,61.9,Review
107,Chicken Powder,Protein Ingredients,Plateau,Lagos,Green Harvest Plateau Ltd,SUP-047,kg,"1,038.21",92.9,16,73.6,100,"1,000",Fully Match,ISO 9001; HACCP,No,No,Active,96,99.0,4.6,50.7,Review
108,Beef Powder,Protein Ingredients,Lagos,Lagos,Unity Agro Lagos Ltd,SUP-077,kg,908.91,83.5,4,76.1,75,250,Fully Match,NAFDAC,Yes,Yes,Active,47,83.0,6.1,63.6,Review
108,Beef Powder,Protein Ingredients,Oyo,Lagos,Northern Agro Oyo Ltd,SUP-062,kg,704.39,81.0,14,72.6,5,250,Fully Match,SON; HACCP,Yes,No,Inactive,98,97.0,1.9,61.5,Review
109,Bone Broth Powder,Protein Ingredients,Plateau,Lagos,Northern Agro Plateau Ltd,SUP-063,kg,714.29,80.3,12,98.1,5,"5,000",Fully Match,SON; HACCP,Yes,No,Inactive,86,96.0,2.5,64.7,Review
109,Bone Broth Powder,Protein Ingredients,Ondo,Lagos,Green Harvest Ondo Ltd,SUP-046,kg,637.06,92.8,16,70.7,150,"2,000",Fully Match,NAFDAC; SON,Yes,No,Inactive,37,73.0,3.9,61.0,Review
109,Bone Broth Powder,Protein Ingredients,Kebbi,Lagos,Prime Foods Kebbi Ltd,SUP-066,kg,525.25,86.3,4,92.5,50,"5,000",Fully Match,NAFDAC,Yes,Yes,Inactive,78,81.0,7.5,75.6,Review
110,Food-grade Salt,Minerals,Rivers,Lagos,Green Harvest Rivers Ltd,SUP-048,kg,628.00,94.0,12,85.4,150,"1,000",Partial Match,NAFDAC; SON,Yes,No,Active,63,70.0,3.4,64.4,Review
110,Food-grade Salt,Minerals,Kwara,Lagos,Prime Foods Kwara Ltd,SUP-067,kg,631.02,97.1,11,85.0,75,250,Fully Match,NAFDAC; HACCP,Yes,No,Inactive,52,96.0,6.6,65.6,Review
110,Food-grade Salt,Minerals,Kano,Lagos,Naija Commodities Kano Ltd,SUP-051,kg,606.45,74.8,8,73.8,100,500,Partial Match,ISO 9001; HACCP,No,Yes,Active,78,73.0,6.9,49.9,Review
110,Food-grade Salt,Minerals,Lagos,Lagos,FreshSource Lagos Ltd,SUP-028,kg,453.35,88.5,5,91.9,150,"2,000",Fully Match,NAFDAC; HACCP; ISO 22000,Yes,Yes,Active,41,87.0,8.5,75.3,Qualified
111,Iodized Salt,Minerals,Cross River,Lagos,Prime Foods Cross River Ltd,SUP-065,kg,"1,261.40",84.6,18,92.2,20,"5,000",Fully Match,NAFDAC,Yes,No,Active,48,82.0,6.1,60.0,Review
111,Iodized Salt,Minerals,Kaduna,Lagos,Naija Commodities Kaduna Ltd,SUP-050,kg,"1,156.26",80.4,14,81.0,30,"1,000",Partial Match,SON; ISO 9001,Yes,No,Active,92,95.0,1.6,60.5,Review`;

function cleanNumber(val: any): number {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[",\s]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function parseSeedCsv(): RawSupplierRecord[] {
  const lines = RAW_SEED_CSV.trim().split("\n");
  const headers = lines[0].split(",");
  const records: RawSupplierRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Regex parse considering quoted CSV fields with commas
    const parts: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        parts.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    parts.push(cur);

    if (parts.length < 24) continue;

    const rec: RawSupplierRecord = {
      id: cleanNumber(parts[0]),
      product: parts[1]?.trim() || "",
      category: parts[2]?.trim() || "",
      market: parts[3]?.trim() || "",
      origin: parts[4]?.trim() || "",
      supplier: parts[5]?.trim() || "",
      supplierId: parts[6]?.trim() || "",
      unit: parts[7]?.trim() || "kg",
      pricePerKg: cleanNumber(parts[8]),
      qualityPct: cleanNumber(parts[9]),
      leadDays: cleanNumber(parts[10]),
      reliabilityPct: cleanNumber(parts[11]),
      capacityTonsMonth: cleanNumber(parts[12]),
      moqKg: cleanNumber(parts[13]),
      spec: (parts[14]?.trim() || "Fully Match") as any,
      certification: parts[15]?.trim() || "",
      certOk: (parts[16]?.trim() === "Yes" ? "Yes" : "No"),
      deliveryOk: (parts[17]?.trim() === "Yes" ? "Yes" : "No"),
      status: (parts[18]?.trim() === "Active" ? "Active" : "Inactive"),
      demandIndex: cleanNumber(parts[19]),
      customerQualityPct: cleanNumber(parts[20]),
      complaintsPct: cleanNumber(parts[21]),
      supplierScore: cleanNumber(parts[22]),
      qualification: (parts[23]?.trim() || "Review") as any,
    };
    records.push(rec);
  }

  return records;
}

export const INITIAL_SEED_DATA: RawSupplierRecord[] = parseSeedCsv();
