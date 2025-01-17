package study;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class boj_문자열반복 {

	public static void main(String[] args) throws NumberFormatException, IOException {
		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
		StringTokenizer st;

		int T = Integer.parseInt(br.readLine());

		for (int tc = 0; tc < T; tc++) {
			st = new StringTokenizer(br.readLine());
			int R = Integer.parseInt(st.nextToken());
			String str = st.nextToken();

			StringBuilder sb = new StringBuilder();
			for (int i = 0; i < str.length(); i++) {
				char result = str.charAt(i);
				for (int j = 0; j < R; j++) {
					sb.append(result);
				}
//				System.out.println(sb);
			}
			System.out.println(sb);

		}

	}

}
