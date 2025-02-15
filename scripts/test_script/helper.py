import json

def split_file_into_sections(input_filename: str, output_filename: str, num_sections: int):
    """
    Splits a file into a specified number of sections based on lines and writes it to a JSON file.
    Each section is a single concatenated string of lines.

    :param input_filename: Path to the input file.
    :param output_filename: Path to the output JSON file.
    :param num_sections: Number of sections to split the file into.
    """
    with open(input_filename, "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f.readlines()]  # Remove trailing newlines

    total_lines = len(lines)
    section_size = max(1, total_lines // num_sections)  # Ensure at least 1 line per section

    sections = []
    for i in range(num_sections):
        start = i * section_size
        end = (i + 1) * section_size if i < num_sections - 1 else total_lines  # Last section gets remaining lines
        section = "\n".join(lines[start:end])  # Concatenate lines into one string
        sections.append(section)

    with open(output_filename, "w", encoding="utf-8") as f:
        json.dump(sections, f, indent=4, ensure_ascii=False)

    print(f"Split into {num_sections} sections and saved to {output_filename}")


if __name__ == "__main__":
    split_file_into_sections("tests/data/sample_study_note.txt", "tests/data/sample_static_sectioning_by_num_of_section.json", 10)
