import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class TestRunner {

    public static void main(String[] args) {
        WebDriver driver = new ChromeDriver();
        driver.get("https://example.com");

        String title = driver.getTitle();
        if (title.contains("Example")) {
            System.out.println("PASS");
        } else {
            System.out.println("FAIL");
        }

        driver.quit();
    }
}
