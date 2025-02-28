from abc import ABC, abstractmethod
from core.models.note import Note
from core.models.section import Section

class SectioningStrategy(ABC):
    """ Abstract class for sectioning strategy """

    @abstractmethod
    def process(self, note: Note) -> list[Section]:
        """ Section note based on the desired number of section """
        pass

class StaticSectioningStrategy(SectioningStrategy):
    """ Class for static sectioning strategy """

    def __init__(self, num_of_section):
        self.num_of_section = num_of_section

    def process(self, note: Note) -> list[Section]:
        """
            For static sectioning, simply section by number of lines to achieve
            desired number of sections
        """

        lines = [line.strip() for line in note.content.split("\n")]  # Remove trailing newlines

        num_of_section = self.num_of_section

        total_lines = len(lines)
        section_size = max(1, total_lines // num_of_section)  # Ensure at least 1 line per section
        sections = []
        for i in range(num_of_section):
            start = i * section_size
            end = (i + 1) * section_size if i < num_of_section - 1 else total_lines  # Last section gets remaining lines
            section_text = "\n".join(lines[start:end])  # Concatenate lines into one string
            sections.append(Section(section_text))

        return sections



        

