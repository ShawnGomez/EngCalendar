from scraper import scrape
from topsql import save 

def main():
    assignments = scrape()

    print(f"Scraped {len(assignments)} assignments")

    save(assignments)
    print("Saved to DB")


if __name__ == "__main__":
    main()
