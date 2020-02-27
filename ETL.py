# Import dependencies
import pandas as pd 
from sqlalchemy import create_engine

# Load the Distillery .csv file
csv_file = "./data/Distillery.csv"
distillery_data_df = pd.read_csv(csv_file)

# Create a distillery dataframe, keeping only the columns desired
new_distillery_data_df = distillery_data_df[['Company', 'Country', 'Rating', 'Whisky', 'Collection', 'lon', 'lat']].copy()
new_distillery_data_df = new_distillery_data_df.dropna(how="any")

# Load the Whisky Brand .csv file
csv_file = "./data/Whisky_Brand.csv"
brand_data_df = pd.read_csv(csv_file)

# Createa a whisky brand dataframe, keeping only the columns desired
new_brand_data_df = brand_data_df[['Brand', 'Country', 'Whiskies', 'Votes', 'Rating', 'Brand_Ranking']].copy()
new_brand_data_df = new_brand_data_df.dropna(how="any")

# Create SQL Engine
connection_string = "postgres:password@localhost:5432/project-2"
engine = create_engine(f'postgresql://{connection_string}')
print(connection_string)

# Adding data to the dataframe
engine.table_names()
new_brand_data_df.to_sql(name='brand', con=engine, if_exists='append', index=True)
new_distillery_data_df.to_sql(name='company', con=engine, if_exists='append', index=True)

