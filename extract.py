import pypdf

with open("output.txt", "w", encoding="utf-8") as f:
    f.write("--- Task PDF ---\n")
    reader1 = pypdf.PdfReader('HH_Goa_2026_Shortlisting_Task.pdf')
    for p in reader1.pages:
        f.write(p.extract_text() + "\n")
        
    f.write("--- Site PDF ---\n")
    reader2 = pypdf.PdfReader('hhgoasite.pdf')
    for p in reader2.pages:
        f.write(p.extract_text() + "\n")
