import logo from "@/assets/logo.png";

const SiteFooter = () => (
  <footer className="border-t border-border/50 bg-background py-6">
    <div className="container mx-auto px-4 flex flex-col items-center gap-2 text-xs text-muted-foreground text-center">
      <div className="flex items-center gap-2">
        <img src={logo} alt="N2O" className="w-8 h-8 object-contain" />
        <span className="gold-text font-bold text-sm">N₂O ROSTOV</span>
      </div>
      <span>Ростов-на-Дону</span>
      <span>⚠️ 18+ Продажа лицам младше 18 лет запрещена</span>
      <span className="leading-relaxed">
        Использовать строго в рамках законодательства РФ
      </span>
      <a
        href="http://www.consultant.ru/document/cons_doc_LAW_372879/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary/70 hover:text-primary underline transition-colors"
      >
        Федеральный закон «Об ограничении оборота закиси азота в РФ» от 29.12.2020 N 472-ФЗ
      </a>
      <span>© 2026 Все права защищены</span>
      <a
        href="https://neeklo.ru/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 text-muted-foreground/60 hover:text-primary transition-colors duration-300"
      >
        Разработка{" "}
        <span className="gold-text font-semibold">neeklo.studio</span>
      </a>
    </div>
  </footer>
);

export default SiteFooter;
